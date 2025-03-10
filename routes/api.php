<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hey this new API is working!']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//varify the users email after register
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware('auth:sanctum');



Route::post('/password-reset', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password-reset/confirm', [PasswordResetController::class, 'resetPassword']);
