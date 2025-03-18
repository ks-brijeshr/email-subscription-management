<?php


namespace App\Http\Controllers;

use App\Services\SubscriberExportService;
use App\Models\SubscriptionAnalytics;
use Illuminate\Support\Facades\DB;
use App\Models\SubscriptionList;
use Illuminate\Http\Request;
use App\Models\Subscriber;
use Carbon\Carbon;

class SubscriberController extends Controller
{
    // 1. Add Subscriber to a List   
    public function addSubscriber(Request $request, $list_id)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string',
            'metadata' => 'nullable|array' 
        ]);

        // Check if subscription list exists
        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return response()->json(['error' => 'Subscription list not found.'], 404);
        }

        // Check if subscriber already exists in the list
        $existingSubscriber = Subscriber::where('list_id', $list_id)
            ->where('email', $request->email)
            ->first();

        if ($existingSubscriber) {
            return response()->json(['error' => 'Subscriber already exists in this list.'], 409);
        }

        // Create new subscriber
        $subscriber = Subscriber::create([
            'list_id' => $list_id,
            'email' => $request->email,
            'name' => $request->name,
            'metadata' => json_encode($request->metadata), 
            'status' => 'inactive', 
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Update subscription analytics
        $today = now()->toDateString();
        SubscriptionAnalytics::updateOrCreate(
            ['list_id' => $list_id, 'recorded_date' => $today],
            ['new_subscribers' => DB::raw('new_subscribers + 1')] 
        );

        return response()->json([
            "success" => true,
            "message" => "Subscriber added successfully!",
            "logs" => [
                "subscriber_id" => $subscriber->id,
                "email" => $subscriber->email,
                "recorded_at" => Carbon::parse($subscriber->created_at)->toDateTimeString(),
            ]
        ], 201);
    }

    // 2. Get All Subscribers
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

    // 3. Update Subscriber Status
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

    // 4. Get Subscriber Details
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

    // 5. Add Tags to Subscriber
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

    // 6. Update Subscriber Metadata
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
}
