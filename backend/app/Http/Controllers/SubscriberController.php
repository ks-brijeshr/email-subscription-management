<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use App\Services\SubscriberExportService;
use App\Services\SubscriberService;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    protected $subscriberService;

    public function __construct(SubscriberService $subscriberService)
    {
        $this->subscriberService = $subscriberService;
    }

    public function addSubscriber(Request $request, $list_id)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $response = $this->subscriberService->addSubscriber($list_id, $data);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function verifyEmail($token)
    {
        $response = $this->subscriberService->verifyEmail($token);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function getAllSubscribers($list_id)
    {
        $response = $this->subscriberService->getAllSubscribers($list_id);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function updateSubscriberStatus(Request $request, $subscriber_id)
    {
        $data = $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);

        $response = $this->subscriberService->updateStatus($subscriber_id, $data['status']);

        return response()->json($response, $response['code']);
    }

    public function getSubscriberDetails($subscriber_id)
    {
        $response = $this->subscriberService->getDetails($subscriber_id);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function addSubscriberTags(Request $request, $subscriber_id)
    {
        $data = $request->validate([
            'tags' => 'required|array',
        ]);

        $response = $this->subscriberService->addTags($subscriber_id, $data['tags']);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function updateMetadata(Request $request, $subscriber_id)
    {
        $data = $request->validate([
            'metadata' => 'required|array',
        ]);

        $response = $this->subscriberService->updateMetadata($subscriber_id, $data['metadata']);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function searchSubscribers(Request $request, $list_id)
    {
        $filters = $request->only(['email', 'status', 'tag']);

        $response = $this->subscriberService->search($list_id, $filters);

        return response()->json($response, $response['code'] ?? 200);
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

    public function getBlacklistedEmails()
    {
        $response = $this->subscriberService->getBlacklistedEmails();
        return response()->json($response, $response['code'] ?? 200);
    }
    public function destroy($id)
    {
        $subscriber = Subscriber::findOrFail($id);
        $subscriber->delete();

        return response()->json(['message' => 'Subscriber deleted successfully']);
    }

    // public function bulkDeleteSubscribers(Request $request)
    // {
    //     try {
    //         // Validate that the 'ids' field is an array and contains numbers
    //         $request->validate([
    //             'ids' => 'required|array',
    //             'ids.*' => 'integer',  // Each ID in the array must be an integer
    //         ]);

    //         // Retrieve the IDs from the request
    //         $ids = $request->input('ids');

    //         // Delete subscribers by the given IDs
    //         Subscriber::whereIn('id', $ids)->delete();

    //         return response()->json(['message' => 'Subscribers deleted successfully'], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Failed to delete subscribers: ' . $e->getMessage()], 500);
    //     }
    // }
}
