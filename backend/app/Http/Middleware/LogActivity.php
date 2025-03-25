<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Closure;

class LogUserActivity
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $this->activityLogService->logActivity('Visited ' . $request->path(), $request);
        }

        return $next($request);
    }
}
