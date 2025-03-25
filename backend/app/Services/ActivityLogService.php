<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ActivityLogService
{
    /**
     * Log user activity dynamically
     */
    public function logActivity(string $action, ?Request $request = null)
    {
        $userId = Auth::id(); // Get logged-in user ID

        if (!$userId) {
            return; // Don't log if user is not authenticated
        }

        ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $request?->ip() ?? request()->ip(),
            'user_agent' => $request?->header('User-Agent') ?? request()->header('User-Agent'),
        ]);
    }

    /**
     * Get all activities for the authenticated user
     */
    public function getUserActivityLogs()
    {
        $userId = Auth::id();

        if (!$userId) {
            return []; // Return empty array if user is not authenticated
        }

        return ActivityLog::where('user_id', $userId)->latest()->get();
    }
}
