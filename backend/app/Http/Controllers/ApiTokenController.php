<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ApiToken;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ApiTokenController extends Controller
{
    public function index()
    {
        $tokens = ApiToken::where('user_id', Auth::id())->get();

        return response()->json(['tokens' => $tokens]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'expires_at' => 'nullable|date',
        ]);

        // Get authenticated user
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized: User not authenticated.'
            ], 401);
        }

        // Generate new token
        $plainToken = Str::random(60);
        $hashedToken = hash('sha256', $plainToken);

        // Save token in database
        $token = ApiToken::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'token' => $hashedToken,
            'expires_at' => $request->expires_at ?? now()->addMonth(),
        ]);

        return response()->json([
            'token' => $plainToken,
            'message' => 'API Token generated successfully.'
        ]);
    }


    public function revoke($id)
    {
        $token = ApiToken::where('user_id', Auth::id())->where('id', $id)->first();
        if ($token) {
            $token->delete();
            return response()->json(['message' => 'API Token revoked successfully.']);
        }
        return response()->json(['message' => 'Token not found.'], 404);
    }
}
