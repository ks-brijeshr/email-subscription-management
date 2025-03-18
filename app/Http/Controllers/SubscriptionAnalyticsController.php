<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SubscriptionAnalyticsService;
use App\Models\SubscriptionList;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionAnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(SubscriptionAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function getSubscriptionAnalytics(Request $request)
    {
        $request->validate([
            'list_id' => 'required|integer',
        ]);

        $list_id = $request->list_id;

        // Set default start_date (first day of the current month)
        $start_date = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());

        // Set default end_date (today's date)
        $end_date = $request->input('end_date', Carbon::now()->toDateString());

        // Fetch analytics data from subscription_analytics table
        $analytics = DB::table('subscription_analytics')
            ->where('list_id', $list_id)
            ->whereBetween('recorded_date', [$start_date, $end_date])
            ->get();

        return response()->json(['analytics' => $analytics]);
    }

}
