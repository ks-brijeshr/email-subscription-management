<?php

namespace App\Http\Controllers;

use App\Models\BlockedIp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SecurityController extends Controller
{
    /**
     * Get all blocked IPs
     */
    public function getBlockedIPs()
    {
        $blockedIps = BlockedIp::all();
        return response()->json([
            'status' => 'success',
            'data' => $blockedIps
        ]);
    }

    /**
     * Manually block an IP
     */
    public function blockIP(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|ip'
        ]);

        BlockedIp::updateOrCreate(
            ['ip_address' => $request->ip_address],
            [
                'reason' => 'Manually blocked',
                'blocked_by' => Auth::id() ?? 1,
            ]
        );

        Log::warning("Manually blocked IP: {$request->ip_address}");

        return response()->json(['message' => 'IP blocked successfully.'], 201);
    }

    /**
     * Unblock an IP
     */
    public function unblockIP(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|ip'
        ]);

        $blockedIp = BlockedIp::where('ip_address', $request->ip_address)->first();
        if ($blockedIp) {
            $blockedIp->delete();
            Log::info("Unblocked IP: {$request->ip_address}");
            return response()->json(['message' => 'IP unblocked successfully.'], 200);
        }

        return response()->json(['message' => 'IP not found.'], 404);
    }
}
