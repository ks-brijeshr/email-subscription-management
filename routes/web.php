<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UnsubscribeController;

Route::get('/', function () {
    return view('welcome');
});



//Since this is a UI feature, it should be in web.php instead of api.php
Route::get('/unsubscribe/{subscriberId}/{token}', [UnsubscribeController::class, 'showUnsubscribePage'])
    ->name('unsubscribe.confirm');

Route::post('/unsubscribe/{subscriberId}/{token}/confirm', [UnsubscribeController::class, 'confirmUnsubscribe'])
    ->name('unsubscribe.confirm.post');
