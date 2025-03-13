<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\RateLimitLog; // Make sure this model exists
use Illuminate\Support\Facades\Auth;


class RateLimitMiddleware
{



    public function handle(Request $request, Closure $next)
    {
        $key = $this->getRateLimitKey($request);

        if (RateLimiter::tooManyAttempts($key, 10)) {
            RateLimitLog::create([
                'user_id' => Auth::id(),
                'ip_address' => $request->ip(),
                'endpoint' => $request->path(),
                'request_count' => RateLimiter::attempts($key),
            ]);

            return response()->json(['message' => 'Too many requests. Try again later.'], 429);
        }

        RateLimiter::hit($key, 60); // Limit: 5 requests per 60 seconds
        return $next($request);
    }

    private function getRateLimitKey(Request $request)
    {
        return $request->ip() . '|' . $request->path();
    }
}
