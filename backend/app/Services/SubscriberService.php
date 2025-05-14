<?php

namespace App\Services;

use App\Models\Subscriber;
use Illuminate\Support\Str;
use App\Models\EmailBlacklist;
use App\Models\SubscriptionList;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\SubscriberVerificationMail;
use Illuminate\Support\Facades\Validator;

class SubscriberService
{
    public function addSubscriber($list_id, $data)
    {
        $user = Auth::user();
        if (!$user || !$user->is_owner) {
            return ['error' => 'Unauthorized or not allowed.', 'code' => 403];
        }

        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return ['error' => 'Subscription list not found.', 'code' => 404];
        }

        if (Subscriber::where('list_id', $list_id)->where('email', $data['email'])->exists()) {
            return [
                'status' => 'error',
                'message' => 'The email address is already subscribed to this list.',
                'code' => 409
            ];
        }

        $errors = [];

        if ($subscriptionList->allow_business_email_only && $this->isPersonalEmail($data['email'])) {
            $errors[] = 'Personal emails are not allowed.';
        }

        if ($subscriptionList->block_temporary_email && $this->isTemporaryEmail($data['email'])) {
            $errors[] = 'Temporary emails are blocked.';
        }

        if ($subscriptionList->check_domain_existence && !$this->domainExists($data['email'])) {
            $errors[] = 'Email domain does not exist.';
        }

        if ($subscriptionList->verify_dns_records && !$this->hasValidDnsRecords($data['email'])) {
            $errors[] = 'Invalid DNS records.';
        }

        if (!empty($errors)) {
            EmailBlacklist::firstOrCreate([
                'email' => $data['email'],
                'subscription_list_id' => $list_id,
            ], [
                'reason' => implode(', ', $errors),
                'blacklisted_by' => $user->id
            ]);

            return [
                'status' => 'error',
                'message' => 'Email failed validation and has been blacklisted.',
                'errors' => $errors,
                'code' => 422
            ];
        }

        $verificationToken = $subscriptionList->require_email_verification ? Str::uuid()->toString() : null;

        $subscriber = Subscriber::create([
            'list_id' => $list_id,
            'email' => $data['email'],
            'name' => $data['name'] ?? null,
            'metadata' => json_encode($data['metadata'] ?? []),
            'status' => $subscriptionList->require_email_verification ? 'inactive' : 'active',
            'verification_token' => $verificationToken
        ]);

        if ($subscriptionList->require_email_verification) {
            Mail::to($subscriber->email)
                ->queue(new SubscriberVerificationMail($subscriber));
        }

        return [
            'success' => true,
            'message' => 'Subscriber added successfully!',
            'verification_required' => $subscriptionList->require_email_verification
        ];
    }





    public function verifyEmail($token)
    {
        $subscriber = Subscriber::where('verification_token', $token)->first();

        if (!$subscriber) {
            return ['status' => 'error', 'message' => 'Invalid or expired verification token.', 'code' => 404];
        }

        if ($subscriber->status === 'active') {
            return ['status' => 'success', 'message' => 'Email already verified.'];
        }

        $subscriber->update(['status' => 'active', 'verification_token' => null]);

        return ['status' => 'success', 'message' => 'Email verified successfully.'];
    }

    public function getAllSubscribers($list_id)
    {
        $list = SubscriptionList::find($list_id);
        if (!$list) {
            return ['error' => 'Subscription list not found.', 'code' => 404];
        }

        $subscribers = Subscriber::with('tags')->where('list_id', $list_id)->get();

        return [
            'success' => true,
            'list_name' => $list->name,
            'subscribers' => $subscribers->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'name' => $sub->name,
                    'email' => $sub->email,
                    'status' => $sub->status,
                    'tags' => $sub->tags->pluck('tag'),
                    'created_at' => $sub->created_at->toDateTimeString(),
                    'updated_at' => $sub->updated_at->toDateTimeString(),
                    'subscribed_at' => $sub->created_at->toDateTimeString(),
                ];
            })
        ];
    }

    public function updateStatus($subscriber_id, $status)
    {
        $subscriber = Subscriber::find($subscriber_id);
        if (!$subscriber)
            return ['error' => 'Subscriber not found.', 'code' => 404];

        $subscriber->update(['status' => $status]);

        return ['message' => 'Subscriber status updated successfully.', 'code' => 200];
    }

    public function getDetails($subscriber_id)
    {
        $subscriber = Subscriber::with('tags')->find($subscriber_id);
        if (!$subscriber)
            return ['error' => 'Subscriber not found.', 'code' => 404];

        return [
            'success' => true,
            'subscriber' => [
                'id' => $subscriber->id,
                'list_id' => $subscriber->list_id,
                'name' => $subscriber->name,
                'email' => $subscriber->email,
                'tags' => $subscriber->tags->pluck('tag'),
                'metadata' => json_decode($subscriber->metadata),
                'status' => $subscriber->status,
                'created_at' => $subscriber->created_at->toDateTimeString(),
                'updated_at' => $subscriber->updated_at->toDateTimeString()
            ]
        ];
    }

    public function addTags($subscriber_id, $tags)
    {
        $subscriber = Subscriber::find($subscriber_id);
        if (!$subscriber)
            return ['error' => 'Subscriber not found.', 'code' => 404];

        foreach ($tags as $tag) {
            $subscriber->tags()->create(['tag' => $tag]);
        }

        return [
            'success' => true,
            'message' => 'Tags added successfully.',
            'tags' => $subscriber->tags->pluck('tag')
        ];
    }

    public function updateMetadata($subscriber_id, $metadata)
    {
        $subscriber = Subscriber::find($subscriber_id);
        if (!$subscriber)
            return ['error' => 'Subscriber not found.', 'code' => 404];

        $existing = json_decode($subscriber->metadata, true) ?? [];
        $subscriber->update(['metadata' => json_encode(array_merge($existing, $metadata))]);

        return ['success' => true, 'message' => 'Metadata updated.', 'metadata' => array_merge($existing, $metadata)];
    }

    public function search($list_id, $filters)
    {
        $list = SubscriptionList::find($list_id);
        if (!$list)
            return ['error' => 'Subscription list not found.', 'code' => 404];

        $query = Subscriber::where('list_id', $list_id)->with('tags');

        if (!empty($filters['email'])) {
            $query->where('email', 'like', "%{$filters['email']}%");
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['tag'])) {
            $tags = explode(' ', $filters['tag']); // Split by space

            $query->whereHas('tags', function ($q) use ($tags) {
                foreach ($tags as $tag) {
                    $q->orWhere('tag', 'like', "%{$tag}%");
                }
            });
        }



        $results = $query->get();

        return [
            'success' => true,
            'list_name' => $list->name,
            'subscribers' => $results->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'status' => $s->status,
                    'tags' => $s->tags->pluck('tag'),
                    'subscribed_at' => $s->created_at->toDateTimeString()
                ];
            })
        ];
    }



    protected function isPersonalEmail($email)
    {
        $personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        return in_array(explode('@', $email)[1], $personalDomains);
    }

    protected function isTemporaryEmail($email)
    {
        $temporaryDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
        return in_array(explode('@', $email)[1], $temporaryDomains);
    }

    protected function domainExists($email)
    {
        return checkdnsrr(explode('@', $email)[1], 'MX');
    }

    protected function hasValidDnsRecords($email)
    {
        return checkdnsrr(explode('@', $email)[1], 'A') && checkdnsrr(explode('@', $email)[1], 'MX');
    }


    // public function getBlacklistedEmails()
    // {
    //     $user = Auth::user();

    //     if (!$user || !$user->is_owner) {
    //         return ['error' => 'Unauthorized access.', 'code' => 403];
    //     }

    //     $perPage = request()->query('perPage', 5);
    //     $page = request()->query('page', 1);
    //     $subscriptionListId = request()->query('subscription_list_id', null);

    //     // Modify query to filter by subscription list if provided
    //     $query = EmailBlacklist::with('blacklistedBy:id,name,email')
    //         ->where('blacklisted_by', $user->id)
    //         ->orderBy('created_at', 'desc');

    //     if ($subscriptionListId) {
    //         $query->where('subscription_list_id', $subscriptionListId);
    //     }

    //     $paginator = $query->paginate($perPage, ['*'], 'page', $page);

    //     $items = collect($paginator->items())->map(function ($item) {
    //         return [
    //             'id' => $item->id,
    //             'email' => $item->email,
    //             'reason' => $item->reason,
    //             'blacklisted_by' => $item->blacklistedBy
    //                 ? $item->blacklistedBy->name . ' (' . $item->blacklistedBy->email . ')'
    //                 : 'Unknown',
    //             'created_at' => $item->created_at->toDateTimeString(),
    //         ];
    //     });

    //     return [
    //         'success' => true,
    //         'blacklisted_emails' => $items,
    //         'pagination' => [
    //             'total' => $paginator->total(),
    //             'perPage' => $paginator->perPage(),
    //             'currentPage' => $paginator->currentPage(),
    //             'lastPage' => $paginator->lastPage(),
    //             'nextPageUrl' => $paginator->nextPageUrl(),
    //             'prevPageUrl' => $paginator->previousPageUrl(),
    //         ]
    //     ];
    // }
    public function getBlacklistedEmails()
    {
        $user = Auth::user();

        if (!$user || !$user->is_owner) {
            return ['error' => 'Unauthorized access.', 'code' => 403];
        }

        $perPage = request()->query('perPage', 5);
        $page = request()->query('page', 1);
        $subscriptionListId = request()->query('subscription_list_id', null);

        $query = EmailBlacklist::with('blacklistedBy:id,name,email')
            ->where('blacklisted_by', $user->id)
            ->orderBy('created_at', 'desc');

        if ($subscriptionListId) {
            $query->where('subscription_list_id', $subscriptionListId);
        }

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $items = collect($paginator->items())->map(function ($item) {
            return [
                'id' => $item->id,
                'email' => $item->email,
                'reason' => $item->reason,
                'blacklisted_by' => $item->blacklistedBy
                    ? $item->blacklistedBy->name . ' (' . $item->blacklistedBy->email . ')'
                    : 'Unknown',
                'created_at' => $item->created_at->toDateTimeString(),
            ];
        });

        return [
            'success' => true,
            'blacklisted_emails' => $items,
            'pagination' => [
                'total' => $paginator->total(),
                'perPage' => $paginator->perPage(),
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'nextPageUrl' => $paginator->nextPageUrl(),
                'prevPageUrl' => $paginator->previousPageUrl(),
            ]
        ];
    }


    public function deleteSubscriber($id)
    {
        $subscriber = Subscriber::findOrFail($id);
        $subscriber->delete();
    }

 

    public function importSubscribers($file, $listId)
    {
        $subscriptionList = SubscriptionList::findOrFail($listId);

        $extension = strtolower($file->getClientOriginalExtension());
        $subscribers = [];

        if ($extension === 'json') {
            $data = json_decode(file_get_contents($file), true);
            $subscribers = is_array($data) ? $data : [];
        } elseif ($extension === 'csv') {
            $csv = array_map('str_getcsv', file($file));
            if (count($csv) < 2) {
                return [
                    'imported' => 0,
                    'failed' => 0,
                    'errors' => [['reason' => 'CSV has no data']]
                ];
            }

            $headers = array_map('trim', $csv[0]);
            foreach (array_slice($csv, 1) as $row) {
                if (count($row) !== count($headers)) continue;

                $rowAssoc = array_combine($headers, $row);

                $subscriber = [
                    'name' => trim($rowAssoc['name'] ?? ''),
                    'email' => trim($rowAssoc['email'] ?? ''),
                    'status' => trim($rowAssoc['status'] ?? ''),
                ];

                if (empty($subscriber['email'])) continue;

                $subscribers[] = $subscriber;
            }
        } else {
            return [
                'imported' => 0,
                'failed' => 0,
                'errors' => [['reason' => 'Unsupported file type']]
            ];
        }

        $imported = 0;
        $failed = 0;
        $errors = [];

        $validStatuses = ['active', 'inactive', 'blacklisted'];

        foreach ($subscribers as $index => $subscriber) {
            $validator = Validator::make($subscriber, [
                'email' => 'required|email',
                'name' => 'nullable|string|max:255',
                'status' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                $failed++;
                $errors[] = [
                    'index' => $index,
                    'email' => $subscriber['email'] ?? '',
                    'reason' => $validator->errors()->first(),
                ];
                continue;
            }

            // Check if email already exists in this list
            $exists = Subscriber::where('email', $subscriber['email'])
                ->where('list_id', $listId)
                ->exists();

            if ($exists) {
                $failed++;
                $errors[] = [
                    'index' => $index,
                    'email' => $subscriber['email'],
                    'reason' => 'Duplicate: Email already exists in this list',
                ];
                continue;
            }

            if (!$this->passesListRules($subscriptionList, $subscriber['email'])) {
                $failed++;
                $errors[] = [
                    'index' => $index,
                    'email' => $subscriber['email'],
                    'reason' => 'Email failed list validation rules',
                ];
                continue;
            }

            $status = in_array($subscriber['status'], $validStatuses)
                ? $subscriber['status']
                : 'inactive';

            try {
                Subscriber::create([
                    'list_id' => $listId,
                    'name' => $subscriber['name'] ?: null,
                    'email' => $subscriber['email'],
                    'status' => $status,
                    'unsubscribe_token' => Str::random(32),
                ]);
                $imported++;
            } catch (\Exception $e) {
                $failed++;
                $errors[] = [
                    'index' => $index,
                    'email' => $subscriber['email'],
                    'reason' => 'Database error: ' . $e->getMessage(),
                ];
            }
        }
        return compact('imported', 'failed', 'errors');
    }

    private function passesListRules($list, $email)
    {
        $domain = substr(strrchr($email, "@"), 1);

        // Business email check
        if ($list->allow_business_email_only && preg_match('/(gmail\.com|yahoo\.com|hotmail\.com)/i', $domain)) {
            return false;
        }

        // Temporary email check
        if ($list->block_temporary_email && preg_match('/(tempmail|10minutemail|mailinator)/i', $domain)) {
            return false;
        }

        // Domain existence check
        if ($list->check_domain_existence && !checkdnsrr($domain)) {
            return false;
        }

        // DNS record check
        if ($list->verify_dns_records && !checkdnsrr($domain, 'MX')) {
            return false;
        }

        return true;
    }
}
