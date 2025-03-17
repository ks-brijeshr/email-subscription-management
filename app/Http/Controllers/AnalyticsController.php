<?php

namespace App\Http\Controllers;

use App\Models\UnsubscribeLog;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class AnalyticsController extends Controller
{

    public function getUnsubscribeTrends()
    {
        $trends = UnsubscribeLog::selectRaw('recorded_date as date, COUNT(id) as unsubscribed_count')
            ->groupBy('recorded_date')
            ->orderBy('recorded_date', 'ASC')
            ->get();

        return response()->json($trends);
    }
}
