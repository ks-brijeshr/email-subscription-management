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
    public function logActivity(string $activity, ?Request $request = null, $user = null): void
    {
        $user = $user ?? $request?->user() ?? Auth::user();
        $ip = $request?->ip() ?? request()->ip();

        if (!$user) {
            return;
        }

        ActivityLog::create([
            'user_id' => $user->id,
            'activity' => $activity,
            'action' => $activity, // Add this line to fix the error
            'ip_address' => $ip,
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
