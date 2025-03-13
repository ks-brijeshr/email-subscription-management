<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscriber;
use App\Models\SubscriptionList;
use App\Services\SubscriberExportService;
use Carbon\Carbon;

class SubscriberController extends Controller
{
    // 1. Add Subscriber to a List
    public function addSubscriber(Request $request, $list_id)
    {
        $request->validate([
            'email' => 'required|email|unique:subscribers,email',
            'name' => 'nullable|string',
            'metadata' => 'nullable|array' // Metadata should be an array
        ]);

        // Check if subscription list exists
        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return response()->json(['error' => 'Subscription list not found.'], 404);
        }

        // Create subscriber
        $subscriber = Subscriber::create([
            'list_id' => $list_id,
            'email' => $request->email,
            'name' => $request->name,
            'metadata' => json_encode($request->metadata), // Store metadata as JSON
            'status' => 'inactive', // Default status
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
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
}
