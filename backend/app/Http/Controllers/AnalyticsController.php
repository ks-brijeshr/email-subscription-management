<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EmailBlacklist;
use App\Models\EmailVerificationLog;
use App\Models\UnsubscribeLog;
use App\Models\User;
use App\Models\Subscriber;
use App\Models\SubscriptionList;
use App\Models\ActivityLog;
use App\Models\BlacklistedEmail;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{


    public function dashboardStats()
    {
        return response()->json([
            'totalSubscribers' => Subscriber::count(),
            'subscriptionListsCount' => SubscriptionList::count(),
            'recentSubscriptions' => Subscriber::latest()->take(5)->get(),
            'emailVerificationStatus' => [
                'verified' => EmailVerificationLog::where('status', 'verified')->count(),
                'pending' => EmailVerificationLog::where('status', 'pending')->count(),
            ],
            'blacklistedEmails' => EmailBlacklist::count(),
            'adminActivityLogs' => ActivityLog::latest()->take(5)->get(),
            'graphData' => $this->getGraphData(),
        ]);
    }

    private function getGraphData()
    {
        return [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            'data' => [10, 20, 30, 40, 50, 60]
        ];
    }

    public function getUnsubscribeTrends()
    {
        $trends = UnsubscribeLog::selectRaw('recorded_date as date, COUNT(id) as unsubscribed_count')
            ->groupBy('recorded_date')
            ->orderBy('recorded_date', 'ASC')
            ->get();

        return response()->json($trends);
    }
}
