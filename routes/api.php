<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\VerifyRecaptcha;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApiTokenController;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\UnsubscribeController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SubscriberListController;
use App\Http\Controllers\SignupAnalyticsController;
use App\Http\Controllers\SubscriptionListController;
use App\Http\Controllers\SubscriptionAnalyticsController;
use App\Http\Controllers\EmailVerificationStatsController;

Route::get('/test', function () {
    return response()->json(['message' => 'Hey this new API is working!']);
});


Route::post('/register', [AuthController::class, 'register'])->middleware('recaptcha');
Route::post('/login', [AuthController::class, 'login'])->middleware('recaptcha');


//verify the users email after register (API response)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

Route::post('/email/resend', [AuthController::class, 'resendVerificationEmail'])->middleware('auth:sanctum');

//Send reset password link via email
Route::post('/password-reset', [PasswordResetController::class, 'sendResetLink']);

//Reset password
Route::post('/password-reset/confirm', [PasswordResetController::class, 'resetPassword'])->middleware('recaptcha');;


Route::middleware(['auth:sanctum'])->group(function () {
    //Get profile
    Route::get('/profile', [ProfileController::class, 'show']);

    //Update name and email
    Route::put('/profile/update', [ProfileController::class, 'update']);

    //Update password
    Route::put('/profile/update-password', [ProfileController::class, 'updatePassword']);

    //Generate api key
    Route::post('/profile/generate-api-key', [ProfileController::class, 'generateApiKey']);

    //View activity history
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    //Create subscription list
    Route::post('/subscription-list/create', [SubscriptionListController::class, 'store']);

    //Get all subscription lists
    Route::get('/subscription-lists', [SubscriptionListController::class, 'index']);

    //update a specific subscription list
    Route::put('/subscription-lists/{id}', [SubscriptionListController::class, 'update']);

    //delete a subscription list
    Route::delete('/subscription-lists/{id}', [SubscriptionListController::class, 'destroy']);


    //subscriber count in each list
    Route::get('/subscription-lists/subscribers-count', [SubscriptionListController::class, 'index']);


    //logout
    Route::post('/logout', [AuthController::class, 'logout']);



    //Generate and manage all api token
    Route::post('/api-tokens/create', [ApiTokenController::class, 'store']);
    Route::get('/api-tokens', [ApiTokenController::class, 'index']);
    Route::delete('/tokens/{tokenId}', [ApiTokenController::class, 'revoke']);



    //manually get block ips , block/unblock the ip
    Route::get('/blocked-ips', [SecurityController::class, 'getBlockedIPs']);
    Route::post('/block-ip', [SecurityController::class, 'blockIP']);
    Route::post('/unblock-ip', [SecurityController::class, 'unblockIP']);
});



// Secure API routes using 'auth.api_token' middleware
Route::middleware('auth.api_token')->group(function () {
    // Subscriber Management APIs
    Route::get('/api-auth/subscribers/{list_id}', [SubscriberController::class, 'getAllSubscribers']);
    Route::post('/api-auth/subscribers/{list_id}', [SubscriberController::class, 'addSubscriber'])->middleware('owner');
    Route::get('/api-auth/subscriber/{subscriber_id}', [SubscriberController::class, 'getSubscriberDetails'])->middleware('owner');
    Route::put('/api-auth/susbcriber/{subscriber_id}/status', [SubscriberController::class, 'updateSubscriberStatus'])->middleware('owner');

    // Email Validation APIs
    // Route::get('/email-validation/business/{email}', [EmailValidationController::class, 'checkBusinessEmail']);
    // Route::get('/email-validation/temporary/{email}', [EmailValidationController::class, 'checkTemporaryEmail']);
    // Route::get('/email-validation/blacklist/{email}', [EmailValidationController::class, 'checkBlacklistedEmail']);
    // Route::get('/email-validation/dns/{domain}', [EmailValidationController::class, 'checkDNSRecords']);
    // Route::get('/email-validation/subscribed/{email}', [EmailValidationController::class, 'checkSubscribed']);


    // Secure API routes for Subscription List
    Route::get('/api-auth/subscription-lists', [SubscriptionListController::class, 'index']);
    Route::get('/api-auth/subscription-lists/subscribers-count', [SubscriptionListController::class, 'index']);
    Route::post('/api-auth/subscription-list/create', [SubscriptionListController::class, 'store'])->middleware('owner');
    Route::put('/api-auth/subscription-lists/{id}', [SubscriptionListController::class, 'update'])->middleware('owner');
    Route::delete('/api-auth/subscription-lists/{id}', [SubscriptionListController::class, 'destroy'])->middleware('owner');
});




//Email verification for owners who create subscription list
Route::get('/subscription-list/verify/{token}', [SubscriptionListController::class, 'verify']);

//Get subscriber by list
Route::get('/subscribers/{list_id}', [SubscriberListController::class, 'getSubscribersByList']);

Route::middleware(['auth:sanctum', 'rate.limit'])->group(function () {
    Route::get('/subscribers/{list_id}', [SubscriberController::class, 'getAllSubscribers']);
    Route::post('/subscriptions/{list_id}/subscribers', [SubscriberController::class, 'addSubscriber']);
    Route::put('/subscribers/{subscriber_id}/status', [SubscriberController::class, 'updateSubscriberStatus']);
    Route::get('/subscriber/{subscriber_id}', [SubscriberController::class, 'getSubscriberDetails']);
});

//Add subscriber tags
Route::post('/subscribers/{subscriber_id}/tags', [SubscriberController::class, 'addSubscriberTags']);

//Export subscribers(csv, json)
Route::get('/subscriptions/{list_id}/export/{format}', [SubscriberController::class, 'exportSubscribers']);


//Search subscriber
Route::get('/subscriptions/{list_id}/subscribers', [SubscriberController::class, 'searchSubscribers']);



//Unsubscribe link for each subscription list
Route::get('/unsubscribe-link/{subscriberId}', [UnsubscribeController::class, 'getUnsubscribeLink']);
Route::get('/unsubscribe-logs', [UnsubscribeController::class, 'getUnsubscribeLogs']);


//Subscription analytics
Route::get('/subscription-analytics', [SubscriptionAnalyticsController::class, 'getSubscriptionAnalytics']);

//Daily signups
Route::get('/daily-signups', [SignupAnalyticsController::class, 'index']);


//Email verification statistics (how many passed/failed).
Route::get('/email-verification-stats', [EmailVerificationStatsController::class, 'getEmailVerificationStats']);

//Unsubscribe trends
Route::get('/analytics/unsubscribes', [AnalyticsController::class, 'getUnsubscribeTrends']);
