<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProfileService;
use Illuminate\Support\Facades\Auth;




class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function show()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $profileService = new ProfileService($user);
        return response()->json(['user' => $profileService->getProfile()]);
    }

    /**
     * Update profile information (name & email).
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $profileService = new ProfileService($user);
        $updatedUser = $profileService->updateProfile($request->all());

        return response()->json(['message' => 'Profile updated successfully', 'user' => $updatedUser]);
    }

    /**
     * Update password.
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $profileService = new ProfileService($user);
        return response()->json($profileService->updatePassword($request->all()));










    }

    /**
     * Generate API key.
     */
    public function generateApiKey()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }






        $profileService = new ProfileService($user);
        return response()->json($profileService->generateApiKey());


    }
}