<?php

namespace App\Http\Controllers;

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

    public function updateStatus(Request $request, $subscriber_id)
    {
        $data = $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);

        $response = $this->subscriberService->updateStatus($subscriber_id, $data['status']);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function getDetails($subscriber_id)
    {
        $response = $this->subscriberService->getDetails($subscriber_id);

        return response()->json($response, $response['code'] ?? 200);
    }

    public function addTags(Request $request, $subscriber_id)
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
}
