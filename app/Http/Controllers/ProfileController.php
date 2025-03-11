<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Auth;
use App\Services\ProfileService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    protected ActivityLogService $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    /**
     * Get the authenticated user's profile.
     */
    public function show()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $this->activityLogService->logActivity('Visited profile');

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


        $this->activityLogService->logActivity('Name and Email Updated', $request);

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
        $response = $profileService->updatePassword($request->all());


        $this->activityLogService->logActivity('Password updated', $request);

        return response()->json($response);
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
        $response = $profileService->generateApiKey();

        $this->activityLogService->logActivity('Generated API key');

        return response()->json($response);
    }
}
