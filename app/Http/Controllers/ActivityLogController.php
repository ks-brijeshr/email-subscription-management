<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    protected ActivityLogService $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    /**
     * Fetch all activity logs for the authenticated user
     */
    public function index()
    {
        $logs = $this->activityLogService->getUserActivityLogs();

        return response()->json([
            'status' => 'success',
            'activity_logs' => $logs
        ], 200);
    }
}
