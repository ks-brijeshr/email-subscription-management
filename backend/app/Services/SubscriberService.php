<?php

namespace App\Services;

use App\Models\Subscriber;
use App\Models\SubscriptionList;
use App\Models\EmailBlacklist;
use App\Mail\SubscriberVerificationMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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

        $existing = Subscriber::where('list_id', $list_id)->where('email', $data['email'])->first();
        if ($existing) {
            return ['error' => 'Subscriber already exists.', 'code' => 409];
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
            EmailBlacklist::create([
                'email' => $data['email'],
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
            try {
                Mail::to($subscriber->email)->send(new SubscriberVerificationMail($subscriber, $verificationToken));
            } catch (\Exception $e) {
                Log::error("Failed to send verification email: " . $e->getMessage());
                return [
                    'status' => 'error',
                    'message' => 'Subscriber added but failed to send verification email.',
                    'error' => $e->getMessage(),
                    'code' => 500
                ];
            }
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
        if (!$subscriber) return ['error' => 'Subscriber not found.', 'code' => 404];

        $subscriber->update(['status' => $status]);

        return ['message' => 'Subscriber status updated successfully.', 'code' => 200];
    }

    public function getDetails($subscriber_id)
    {
        $subscriber = Subscriber::with('tags')->find($subscriber_id);
        if (!$subscriber) return ['error' => 'Subscriber not found.', 'code' => 404];

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
        if (!$subscriber) return ['error' => 'Subscriber not found.', 'code' => 404];

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
        if (!$subscriber) return ['error' => 'Subscriber not found.', 'code' => 404];

        $existing = json_decode($subscriber->metadata, true) ?? [];
        $subscriber->update(['metadata' => json_encode(array_merge($existing, $metadata))]);

        return ['success' => true, 'message' => 'Metadata updated.', 'metadata' => array_merge($existing, $metadata)];
    }

    public function search($list_id, $filters)
    {
        $list = SubscriptionList::find($list_id);
        if (!$list) return ['error' => 'Subscription list not found.', 'code' => 404];

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

    public function getBlacklistedEmails()
    {
        $user = Auth::user();

        if (!$user || !$user->is_owner) {
            return ['error' => 'Unauthorized access.', 'code' => 403];
        }

        // Only get blacklisted emails that were added by the current user (i.e. the logged-in owner)
        $blacklisted = EmailBlacklist::with('blacklistedBy:id,name,email')
            ->where('blacklisted_by', $user->id)  // Filter by the logged-in user's ID
            ->orderBy('created_at', 'desc')
            ->get();

        return [
            'success' => true,
            'blacklisted_emails' => $blacklisted->map(function ($item) {
                return [
                    'id' => $item->id,
                    'email' => $item->email,
                    'reason' => $item->reason,
                    'blacklisted_by' => $item->blacklistedBy ? $item->blacklistedBy->name . ' (' . $item->blacklistedBy->email . ')' : 'Unknown',
                    'created_at' => $item->created_at->toDateTimeString(),
                ];
            })
        ];
    }
}
