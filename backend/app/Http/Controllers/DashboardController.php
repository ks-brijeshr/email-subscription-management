<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Subscriber;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Models\EmailBlacklist;
use App\Models\SubscriptionList;
use Illuminate\Support\Facades\Log;
use App\Models\EmailVerificationLog;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $ownerId = $request->user()->id;

        return response()->json([
            'totalSubscribers' => Subscriber::whereHas('subscriptionList', fn($query) => $query->where('user_id', $ownerId))->count(),
            'totalBlacklisted' => EmailBlacklist::where('blacklisted_by', $ownerId)->count(),
            'totalSubscriptionLists' => SubscriptionList::where('user_id', $ownerId)->count(),
            'totalEmailVerifications' => EmailVerificationLog::where('user_id', $ownerId)->count(),
            'totalActivityLogs' => ActivityLog::where('user_id', $ownerId)->count(),
        ], 200);
    }

    public function getSubscriberGrowth(Request $request)
    {
        $ownerId = $request->user()->id;

        $growthData = Subscriber::whereHas('subscriptionList', fn($query) => $query->where('user_id', $ownerId))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderByDesc('date')
            ->limit(7)
            ->get();

        return response()->json($growthData, 200);
    }

    public function dashboardStats(Request $request)
    {
        Log::info(ActivityLog::orderBy('created_at', 'desc')->limit(10)->get());

        $ownerId = $request->user()->id;
        $subscriptionListIds = SubscriptionList::where('user_id', $ownerId)->pluck('id');

        return response()->json([
            'totalSubscribers' => Subscriber::whereIn('list_id', $subscriptionListIds)->count(),
            'subscriptionListsCount' => $subscriptionListIds->count(),
            'recentSubscriptions' => Subscriber::whereIn('list_id', $subscriptionListIds)->latest()->take(5)->get(),
            'emailVerificationStatus' => [
                'verified' => EmailVerificationLog::whereIn('user_id', Subscriber::whereIn('list_id', $subscriptionListIds)->pluck('email'))
                    ->where('status', 'verified')->count(),
                'pending' => EmailVerificationLog::whereIn('user_id', Subscriber::whereIn('list_id', $subscriptionListIds)->pluck('email'))
                    ->where('status', 'pending')->count(),
            ],
            'blacklistedEmails' => EmailBlacklist::where('blacklisted_by', $ownerId)->count(),
            'adminActivityLogs' => ActivityLog::where('user_id', $ownerId)->latest()->take(5)->get(),
            'graphData' => $this->getGraphData($ownerId),
        ], 200);
    }

    private function getGraphData($ownerId)
    {
        return Subscriber::whereHas('subscriptionList', fn($query) => $query->where('user_id', $ownerId))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderByDesc('date')
            ->limit(7)
            ->get();

    }

    public function getActivityLogs(Request $request)
    {
        try {
            $logs = ActivityLog::where('user_id', $request->user()->id)
                ->latest()
                ->limit(10)
                ->get();
            return response()->json($logs, 200);
        } catch (\Exception $e) {
            Log::error("Error fetching activity logs: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch activity logs'], 500);
        }
    }
}
