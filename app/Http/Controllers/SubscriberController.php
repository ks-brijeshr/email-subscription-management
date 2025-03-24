<?php

namespace App\Http\Controllers;

use App\Services\SubscriberExportService;
use Symfony\Component\Mime\Part\HtmlPart;
use App\Mail\SubscriberVerificationMail;
use App\Models\SubscriptionAnalytics;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\SubscriptionList;
use App\Models\EmailBlacklist;
use Illuminate\Http\Request;
use App\Models\Subscriber;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SubscriberController extends Controller
{
    // Add subscriber and send verification email
    public function addSubscriber(Request $request, $list_id)
    {

        $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string',
            'metadata' => 'nullable|array'
        ]);

        // Get the logged-in user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized. Please log in.'], 401);
        }

        // Only allow the owner to add subscribers
        if (!$user->is_owner) {
            return response()->json(['error' => 'Only an owner can add subscribers.'], 403);
        }

        // Find the subscription list
        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return response()->json(['error' => 'Subscription list not found.'], 404);
        }

        // Check if subscriber already exists
        $existingSubscriber = Subscriber::where('list_id', $list_id)
            ->where('email', $request->email)
            ->first();
        if ($existingSubscriber) {
            return response()->json(['error' => 'Subscriber already exists.'], 409);
        }

        // Validation based on subscription settings
        $email = $request->email;
        $validationErrors = [];

        if ($subscriptionList->allow_business_email_only && $this->isPersonalEmail($email)) {
            $validationErrors[] = 'Personal emails are not allowed.';
        }

        if ($subscriptionList->block_temporary_email && $this->isTemporaryEmail($email)) {
            $validationErrors[] = 'Temporary emails are blocked.';
        }

        if ($subscriptionList->check_domain_existence && !$this->domainExists($email)) {
            $validationErrors[] = 'Email domain does not exist.';
        }

        if ($subscriptionList->verify_dns_records && !$this->hasValidDnsRecords($email)) {
            $validationErrors[] = 'Invalid DNS records.';
        }

        // If validation fails, blacklist the email & return an error
        if (!empty($validationErrors)) {
            EmailBlacklist::create([
                'email' => $email,
                'reason' => implode(', ', $validationErrors),
                'blacklisted_by' => $user->id
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Email failed validation and has been blacklisted.',
                'errors' => $validationErrors
            ], 422);
        }

        // Generate unique verification token 
        $verificationToken = Str::uuid()->toString();

        // Create subscriber
        $subscriber = Subscriber::create([
            'list_id' => $list_id,
            'email' => $email,
            'name' => $request->name,
            'metadata' => json_encode($request->metadata ?? []),
            'status' => $subscriptionList->require_email_verification ? 'inactive' : 'active',
            'verification_token' => $subscriptionList->require_email_verification ? $verificationToken : null
        ]);

        // Send verification email if required
        if ($subscriptionList->require_email_verification) {
            try {
                Mail::to($subscriber->email)->send(new SubscriberVerificationMail($subscriber, $verificationToken));
            } catch (\Exception $e) {
                Log::error("Failed to send verification email: " . $e->getMessage());

                return response()->json([
                    'status' => 'error',
                    'message' => 'Subscriber added but failed to send verification email.',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        return response()->json([
            "success" => true,
            "message" => "Subscriber added successfully!",
            "verification_required" => $subscriptionList->require_email_verification
        ], 201);
    }



    public function verifyEmail($token)
    {
        // Find subscriber by token
        $subscriber = Subscriber::where('verification_token', $token)->first();

        if (!$subscriber) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired verification token.'
            ], 404);
        }

        if ($subscriber->status === 'active') {
            return response()->json([
                'status' => 'success',
                'message' => 'Email is already verified.'
            ], 200);
        }

        // Update subscriber status to active & remove token
        $subscriber->update([
            'status' => 'active',
            'verification_token' => null
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully. You are now subscribed.'
        ], 200);
    }



    // Get All Subscribers
    public function getAllSubscribers($list_id)
    {
        // Find the subscription list
        $subscriptionList = SubscriptionList::find($list_id);

        if (!$subscriptionList) {
            return response()->json([
                "success" => false,
                "message" => "Subscription list not found."
            ], 404);
        }

        // Fetch all subscribers for this list
        $subscribers = Subscriber::where('list_id', $list_id)
            ->select('id', 'list_id', 'name', 'email', 'created_at', 'updated_at')
            ->get()
            ->map(function ($subscriber) {
                return [
                    "id" => $subscriber->id,
                    "list_id" => $subscriber->list_id,
                    "name" => $subscriber->name,
                    "email" => $subscriber->email,
                    "subscribed_at" => $subscriber->created_at->toDateTimeString(),
                    "created_at" => $subscriber->created_at->toDateTimeString(),
                    "updated_at" => $subscriber->updated_at->toDateTimeString()
                ];
            });

        return response()->json([
            "success" => true,
            "list_name" => $subscriptionList->name,
            "subscribers" => $subscribers
        ]);
    }

    // Update Subscriber Status
    public function updateSubscriberStatus(Request $request, $subscriber_id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,blacklisted'
        ]);

        $subscriber = Subscriber::find($subscriber_id);
        if (!$subscriber) {
            return response()->json(['error' => 'Subscriber not found.'], 404);
        }

        $subscriber->update(['status' => $request->status]);

        return response()->json([
            "message" => "Subscriber status updated successfully."
        ]);
    }

    // Get Subscriber Details
    public function getSubscriberDetails($subscriber_id)
    {
        $subscriber = Subscriber::with('tags')->find($subscriber_id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Subscriber not found.'
            ], 404);
        }

        return response()->json([
            "success" => true,
            "subscriber" => [
                "id" => $subscriber->id,
                "list_id" => $subscriber->list_id,
                "name" => $subscriber->name,
                "email" => $subscriber->email,
                "tags" => $subscriber->tags->pluck('tag'),
                "metadata" => json_decode($subscriber->metadata) ?? (object)[],
                "status" => $subscriber->status,
                "created_at" => $subscriber->created_at->toDateTimeString(),
                "updated_at" => $subscriber->updated_at->toDateTimeString(),
            ]
        ]);
    }

    // Add Tags to Subscriber
    public function addSubscriberTags(Request $request, $subscriber_id)
    {
        $request->validate([
            'tags' => 'required|array',
            'tags.*' => 'string|max:255',
        ]);

        $subscriber = Subscriber::find($subscriber_id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Subscriber not found.'
            ], 404);
        }

        foreach ($request->tags as $tag) {
            $subscriber->tags()->create(['tag' => $tag]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tags added successfully.',
            'tags' => $subscriber->tags->pluck('tag')
        ]);
    }

    // Update Subscriber Metadata
    public function updateSubscriberMetadata(Request $request, $subscriber_id)
    {
        $request->validate([
            'metadata' => 'required|array',
        ]);

        $subscriber = Subscriber::find($subscriber_id);
        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Subscriber not found.'
            ], 404);
        }

        $existingMetadata = json_decode($subscriber->metadata, true) ?? [];
        $updatedMetadata = array_merge($existingMetadata, $request->metadata);

        $subscriber->update(['metadata' => json_encode($updatedMetadata)]);

        return response()->json([
            'success' => true,
            'message' => 'Metadata updated successfully.',
            'metadata' => $updatedMetadata
        ]);
    }

    public function exportSubscribers($list_id, $format, SubscriberExportService $exportService)
    {
        if ($format === 'csv') {
            return $exportService->exportAsCSV($list_id);
        } elseif ($format === 'json') {
            return $exportService->exportAsJSON($list_id);
        } else {
            return response()->json(['error' => 'Invalid format. Use CSV or JSON.'], 400);
        }
    }

    public function searchSubscribers(Request $request, $list_id)
    {
        // Validate that the subscription list exists
        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return response()->json([
                "success" => false,
                "error" => "Subscription list not found."
            ], 404);
        }

        // Get filters from request
        $email = $request->query('email');  // Search by email
        $status = $request->query('status');  // Filter by status (active/inactive)
        $tag = $request->query('tag');  // Filter by tag

        // Query builder for subscribers
        $query = Subscriber::where('list_id', $list_id)->with('tags');

        if (!empty($email)) {
            $query->where('email', 'LIKE', "%$email%");
        }

        if (!empty($status)) {
            $query->where('status', $status);
        }

        if (!empty($tag)) {
            $query->whereHas('tags', function ($q) use ($tag) {
                $q->where('tag', 'LIKE', "%$tag%");
            });
        }

        // Get results
        $subscribers = $query->get();

        // Return response
        return response()->json([
            "success" => true,
            "list_name" => $subscriptionList->name,
            "subscribers" => $subscribers->map(function ($subscriber) {
                return [
                    "id" => $subscriber->id,
                    "name" => $subscriber->name,
                    "email" => $subscriber->email,
                    "tags" => $subscriber->tags->pluck('tag')->toArray(),
                    "status" => $subscriber->status,
                    "subscribed_at" => $subscriber->created_at->toDateTimeString(),
                ];
            })
        ]);
    }

    private function isPersonalEmail($email)
    {
        return preg_match('/@(gmail\.com|yahoo\.com|hotmail\.com)$/i', $email);
    }

    private function isTemporaryEmail($email)
    {
        $tempDomains = ['tempmail.com', 'disposable.com'];
        return in_array(explode('@', $email)[1], $tempDomains);
    }

    private function domainExists($email)
    {
        return checkdnsrr(explode('@', $email)[1], 'MX');
    }

    private function hasValidDnsRecords($email)
    {
        $domain = explode('@', $email)[1];
        return checkdnsrr($domain, 'A') || checkdnsrr($domain, 'AAAA') || checkdnsrr($domain, 'MX');
    }
}
