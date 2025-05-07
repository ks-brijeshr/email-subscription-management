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
        $subscribers = Subscriber::where('list_id', $list_id)
            ->where('status', 'active')
            ->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['message' => 'No active subscribers found for this list.'], 204);
        }

        $filename = "active_subscribers_list_{$list_id}.csv";
        $filePath = storage_path("app/public/" . $filename);

        $file = fopen($filePath, 'w');
        fputcsv($file, ['ID', 'Name', 'Email', 'Status', 'Created At']);

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
        $subscribers = Subscriber::where('list_id', $list_id)
            ->where('status', 'active')
            ->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['message' => 'No active subscribers found for this list.'], 204);
        }

        $filename = "active_subscribers_list_{$list_id}.json";
        $filePath = storage_path("app/public/" . $filename);

        Storage::disk('public')->put($filename, $subscribers->toJson(JSON_PRETTY_PRINT));

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
