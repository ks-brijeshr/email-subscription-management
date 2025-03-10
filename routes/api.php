<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hey this new API is working!']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//varify the users email after register (API response)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware('auth:sanctum');



Route::post('/password-reset', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password-reset/confirm', [PasswordResetController::class, 'resetPassword']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/update-password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/generate-api-key', [ProfileController::class, 'generateApiKey']);
});
