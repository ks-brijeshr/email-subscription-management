<?php

namespace App\Services;

use Illuminate\Auth\Events\Registered;
use App\Models\User;
use App\Models\EmailVerificationLog;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Handle user registration
     */
    public function register(array $validatedData): User
    {
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'is_owner' => filter_var($validatedData['is_owner'], FILTER_VALIDATE_BOOLEAN),
        ]);

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
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return ['error' => 'Invalid credentials'];
        }

        // Restrict login if email is not verified
        if (!$user->hasVerifiedEmail()) {
            return ['error' => 'Your email is not verified. Please check your email for verification.'];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user
        ];
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
