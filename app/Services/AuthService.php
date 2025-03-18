<?php

namespace App\Services;

use App\Models\User;
use App\Models\BlockedIp;
use App\Models\DailySignup;
use App\Models\FailedLogin;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\EmailVerificationLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;



class AuthService
{
    const MAX_FAILED_ATTEMPTS = 5; // Set limit before blocking
    const BLOCK_DURATION = 1; // Minutes to block

    /**
     * Handle user registration
     */
    public function register(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_owner' => filter_var($data['is_owner'], FILTER_VALIDATE_BOOLEAN),
        ]);


        // Track daily signups
        $date = Carbon::today()->toDateString();
        $signup = DailySignup::where('date', $date)->first();

        if ($signup) {
            $signup->increment('count'); // Increase count if record exists
        } else {
            DailySignup::create([
                'date' => $date,
                'count' => 1
            ]);
        }

        event(new Registered($user));

        // Log as "failed" (unverified user)
        EmailVerificationLog::create([
            'user_id' => $user->id,
            'status' => 'failed',
            'attempted_at' => now(),
        ]);


        return $user;
    }



    /**
     * Handle user login (Only allow verified users)
     */
    public function login(array $credentials)
    {

        $ip = request()->ip();
        $key = 'login_attempts_' . $ip;

        // Check if the IP is blocked
        if ($this->isBlocked($ip)) {
            return response()->json(['error' => 'Too many failed login attempts. Try again later.'], 429);
        }

        // Find user by email
        $user = User::where('email', $credentials['email'])->first();

        // If user not found or password incorrect
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            $this->logFailedAttempt($ip, $credentials['email']); // Log failed attempt

            if ($this->getFailedAttempts($ip) >= self::MAX_FAILED_ATTEMPTS) {
                $this->blockIP($ip); // Block IP after max attempts
                return response()->json(['error' => 'Too many failed login attempts. Try again later.'], 429);
            }

            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['error' => 'Your email is not verified. Please check your email.'], 403);
        }

        // Successful login, clear failed attempts
        $this->clearFailedAttempts($ip);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ], 200);
    }

    /**
     *  Log failed login attempts
     */
    private function logFailedAttempt($ip, $email)
    {
        Log::info("Logging failed attempt for IP: $ip, Email: $email");

        FailedLogin::create([
            'ip_address' => $ip,
            'email' => $email,
            'attempted_at' => now(),
        ]);
    }

    /**
     * Block an IP after too many failed attempts
     */
    private function blockIP($ip)
    {
        Log::warning("Blocking IP: $ip due to too many failed login attempts.");

        FailedLogin::create([
            'ip_address' => $ip,
            'email' => null,
            'attempted_at' => now(),
        ]);

        BlockedIp::updateOrCreate(
            ['ip_address' => $ip],
            [
                'reason' => 'Too many failed login attempts',
                'blocked_by' => Auth::id() ?? 1,     // Use system user or default admin if not authenticated
            ]
        );
    }


    /**
     *  Check if an IP is blocked
     */
    private function isBlocked($ip)
    {
        // Get failed attempts within the block duration
        $failedAttempts = FailedLogin::where('ip_address', $ip)
            ->where('attempted_at', '>=', now()->subMinutes(self::BLOCK_DURATION))
            ->count();

        // If attempts exceed the max allowed, check time duration
        if ($failedAttempts >= self::MAX_FAILED_ATTEMPTS) {
            // Get the last failed attempt
            $lastAttempt = FailedLogin::where('ip_address', $ip)
                ->orderBy('attempted_at', 'desc')
                ->first();

            if ($lastAttempt) {
                // Calculate time difference
                $minutesSinceLastAttempt = now()->diffInMinutes($lastAttempt->attempted_at);

                // If the block duration has passed, unblock the IP
                if ($minutesSinceLastAttempt >= self::BLOCK_DURATION) {
                    $this->clearFailedAttempts($ip); // Clear failed attempts
                    return false;
                }
            }

            return true; // Still blocked
        }

        return false; // Not blocked yet
    }

    /**
     * Get the count of failed attempts
     */
    private function getFailedAttempts($ip)
    {
        return FailedLogin::where('ip_address', $ip)
            ->where('attempted_at', '>=', now()->subMinutes(self::BLOCK_DURATION))
            ->count();
    }

    /**
     * Clear failed attempts after successful login
     */
    private function clearFailedAttempts($ip)
    {
        FailedLogin::where('ip_address', $ip)->delete();
    }

    /**
     * Mark email verification as passed
     */
    public function markEmailAsVerified(User $user)
    {
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();

            // Update verification log to passed
            EmailVerificationLog::where('user_id', $user->id)
                ->update(['status' => 'passed']);
        }
    }
}
