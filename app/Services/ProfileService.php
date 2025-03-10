<?php

namespace App\Services;

use App\Models\User;
use App\Models\ApiToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get user profile.
     */
    public function getProfile()
    {
        return $this->user;
    }

    /**
     * Update profile information (name & email).
     */
    public function updateProfile($data)
    {
        $this->user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        return $this->user;
    }

    /**
     * Update password.
     */
    public function updatePassword($data)
    {
        if (!Hash::check($data['current_password'], $this->user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Incorrect current password']);
        }

        $this->user->password = Hash::make($data['new_password']);
        $this->user->save();

        return ['message' => 'Password updated successfully'];
    }

    /**
     * Generate API key.
     */
    public function generateApiKey()
    {
        $token = Str::random(60);

        ApiToken::create([
            'user_id' => $this->user->id,
            'token' => hash('sha256', $token),
            'status' => 'active',
        ]);

        return [
            'message' => 'API key generated successfully',
            'api_key' => $token,
        ];
    }
}