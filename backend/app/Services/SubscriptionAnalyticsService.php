<?php

namespace App\Services;

use App\Models\SubscriptionAnalytics;

class SubscriptionAnalyticsService
{
    public function getSubscriptionAnalytics($list_id, $start_date, $end_date)
    {
        return SubscriptionAnalytics::where('list_id', $list_id)
            ->whereBetween('recorded_date', [$start_date, $end_date])
            ->orderBy('recorded_date', 'asc')
            ->get(['recorded_date as date', 'new_subscribers']);
    }

 
}
