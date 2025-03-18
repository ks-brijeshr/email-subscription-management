<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\LoginRequest;
use App\Models\EmailVerificationLog;
use App\Services\ActivityLogService;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
    protected AuthService $authService;
    protected ActivityLogService $activityLogService;

    public function __construct(AuthService $authService, ActivityLogService $activityLogService)
    {
        $this->authService = $authService;
        $this->activityLogService = $activityLogService;
    }

    /**
     * Handle user registration
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());

        Auth::login($user);

        $this->activityLogService->logActivity('User registered', $request);

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully. Please verify your email.',
            'is_owner' => $user->is_owner,
            'user' => $user
        ], 201);
    }

    /**
     * Handle user login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        //Directly return the JSON response from AuthService
        return $this->authService->login($request->validated());
    }

    /**
     * Handle email verification when user clicks the verify email link 
     */
    public function verifyEmail(Request $request, $id, $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        // Log email verification as "passed"
        EmailVerificationLog::updateOrCreate(
            ['user_id' => $user->id],
            ['status' => 'passed', 'attempted_at' => now()]
        );

        $this->activityLogService->logActivity('Email verified', $request);

        return response()->json(['message' => 'Email verified successfully.'], 200);
    }

    /**
     * Resend email verification link
     */
    public function resendVerificationEmail(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        $this->activityLogService->logActivity('Resent verification email', $request);

        return response()->json(['message' => 'Verification email resent.'], 200);
    }

    /**
     * Logout removes the personal access token from databse  
     *
     * @param Request $request
     * @return json response  
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user(); // Get authenticated user

        // Revoke user's token
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}
