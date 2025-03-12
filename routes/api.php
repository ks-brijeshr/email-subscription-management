<?php

use App\Http\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriberListController;
use App\Http\Controllers\SubscriptionListController;
use App\Http\Controllers\SubscriberController;


Route::get('/test', function () {
    return response()->json(['message' => 'Hey this new API is working!']);
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//verify the users email after register (API response)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware('auth:sanctum');



Route::post('/password-reset', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password-reset/confirm', [PasswordResetController::class, 'resetPassword']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/update-password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/generate-api-key', [ProfileController::class, 'generateApiKey']);
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    Route::post('/subscription-list/create', [SubscriptionListController::class, 'store']);
    //Get all subscription lists
    Route::get('/subscription-lists', [SubscriptionListController::class, 'index']);
    //update a specific subscription list
    Route::put('/subscription-lists/{id}', [SubscriptionListController::class, 'update']);

    //delete a subscription list
    Route::delete('/subscription-lists/{id}', [SubscriptionListController::class, 'destroy']);


    //subscriber count in each list
    Route::get('/subscription-lists/subscribers-count', [SubscriptionListController::class, 'index']);

});



//Email verification for owners who create subscription list
Route::get('/subscription-list/verify/{token}', [SubscriptionListController::class, 'verify']);



Route::get('/subscribers/{list_id}', [SubscriberListController::class, 'getSubscribersByList']);



Route::post('/subscriptions/{list_id}/subscribers', [SubscriberController::class, 'addSubscriber']);
Route::get('/subscribers/{list_id}', [SubscriberController::class, 'getAllSubscribers']);
Route::put('/subscribers/{subscriber_id}/status', [SubscriberController::class, 'updateSubscriberStatus']);
Route::post('/unsubscribe/{subscriber_id}', [SubscriberController::class, 'unsubscribeUser']);
