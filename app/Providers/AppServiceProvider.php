<?php

namespace App\Providers;

use App\Http\Middleware\RateLimitMiddleware;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->singleton(ActivityLogService::class, function ($app) {
            return new ActivityLogService();
        });
    }


    /**
     * Bootstrap any application services.
     */

    public function boot(): void
    {
        Route::aliasMiddleware('rate.limit', RateLimitMiddleware::class);
    }
}
