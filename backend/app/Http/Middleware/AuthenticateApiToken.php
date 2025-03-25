<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ApiToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AuthenticateApiToken
{

    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken(); // Get token from Authorization header

        if (!$token) {
            return response()->json(['error' => 'API token required'], 401);
        }

        // Validate the token from `api_tokens` table
        $apiToken = ApiToken::where('token', hash('sha256', $token))->first();

        if (!$apiToken) {
            return response()->json(['error' => 'Invalid API token'], 403);
        }

        // Authenticate user
        $user = $apiToken->user;

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        Auth::setUser($user); //Authenticate the user

        // Store user role in request
        $request->merge(['is_owner' => $user->is_owner]);

        return $next($request);
    }
}
