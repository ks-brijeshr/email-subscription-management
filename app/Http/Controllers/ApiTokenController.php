<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\ApiToken;

class ApiTokenController extends Controller
{
    /**
     * Generate a new API token.
     */
    public function generateToken(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'array',
            'abilities.*' => 'string',
            'expires_at' => 'nullable|date',
        ]);

        $user = Auth::user();

        // Generate a random token
        $plainTextToken = Str::random(64);

        // Store in database directly
        $token = ApiToken::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'token' => hash('sha256', $plainTextToken), // Store hashed token for security
            'abilities' => json_encode($request->input('abilities', ['*'])), // Store as JSON
            'expires_at' => $request->expires_at,
        ]);

        return response()->json([
            'message' => 'API token generated successfully.',
            'token' => $plainTextToken, // Return plain text token for use
            'token_id' => $token->id
        ], 201);
    }

    /**
     * Get all tokens of the authenticated user.
     */
    public function getTokens()
    {
        $user = Auth::user();

        // Fetch tokens directly from the database
        $tokens = ApiToken::where('user_id', $user->id)->get()->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'token_last_digits' => substr($token->token, -4),
                'abilities' => json_decode($token->abilities, true),
                'expires_at' => $token->expires_at,
                'created_at' => $token->created_at
            ];
        });

        return response()->json([
            'tokens' => $tokens,
        ]);
    }

    /**
     * Revoke a specific token.
     */
    public function revokeToken($tokenId)
    {
        $user = Auth::user();

        // Find and delete the token directly
        $token = ApiToken::where('id', $tokenId)->where('user_id', $user->id)->first();

        if (!$token) {
            return response()->json(['message' => 'Token not found.'], 404);
        }

        $token->delete();

        return response()->json(['message' => 'Token revoked successfully.']);
    }

    /**
     * Revoke all API tokens of the authenticated user.
     */
    public function revokeAllTokens()
    {
        $user = Auth::user();

        // Delete all tokens directly from the database
        ApiToken::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'All API tokens revoked.']);
    }
}
