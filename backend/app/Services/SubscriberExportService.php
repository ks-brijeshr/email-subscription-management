<?php

namespace App\Services;

use App\Models\Subscriber;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class SubscriberExportService
{
    /**
     * Export subscribers as CSV
     */
    public function exportAsCSV($list_id)
    {
        // Fetch only active subscribers
        $subscribers = Subscriber::where('list_id', $list_id)
            ->where('status', 'active')  // Only active subscribers
            ->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['error' => 'No active subscribers found for this list.'], 404);
        }

        $filename = "active_subscribers_list_{$list_id}.csv";
        $filePath = storage_path("app/public/" . $filename);

        // Open file and write headers
        $file = fopen($filePath, 'w');
        fputcsv($file, ['ID', 'Name', 'Email', 'Status', 'Created At']);

        // Write subscriber data
        foreach ($subscribers as $subscriber) {
            fputcsv($file, [
                $subscriber->id,
                $subscriber->name,
                $subscriber->email,
                $subscriber->status,
                $subscriber->created_at->toDateTimeString()
            ]);
        }

        fclose($file);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    /**
     * Export subscribers as JSON
     */
    public function exportAsJSON($list_id)
    {
        // Fetch only active subscribers
        $subscribers = Subscriber::where('list_id', $list_id)
            ->where('status', 'active')  // Only active subscribers
            ->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['error' => 'No active subscribers found for this list.'], 404);
        }

        $filename = "active_subscribers_list_{$list_id}.json";
        $filePath = storage_path("app/public/" . $filename);

        // Save the JSON file
        Storage::disk('public')->put($filename, $subscribers->toJson(JSON_PRETTY_PRINT));

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
