<?php

namespace App\Http\Controllers;

use App\Models\EmailVerificationLog;
use Illuminate\Http\JsonResponse;

class EmailVerificationStatsController extends Controller
{
    /**
     * Get email verification statistics (passed/failed count)
     */
    public function getEmailVerificationStats(): JsonResponse
    {
        $passed = EmailVerificationLog::where('status', 'passed')->count();
        $failed = EmailVerificationLog::where('status', 'failed')->count();

        return response()->json([
            'total_verified' => $passed,
            'total_failed' => $failed,
        ]);
    }
}
