<?php

namespace App\Services;

use App\Models\User;
use App\Mail\VerifyEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use Illuminate\Auth\Events\Registered;

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

        //Laravel's built-in event for email verification
        event(new Registered($user));

        return $user;
    }



    /**
     * Handle user login
     */
    public function login(array $data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return ['error' => 'Invalid credentials'];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}
