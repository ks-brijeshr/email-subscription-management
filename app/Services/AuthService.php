<?php

namespace App\Services;

use Illuminate\Auth\Events\Registered;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;
use App\Models\User;

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

        //Restrict login if email is not verified
        if (!$user->hasVerifiedEmail()) {
            return ['error' => 'Your email is not verified. Please check your email for verification.'];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user
        ];
    }
}
