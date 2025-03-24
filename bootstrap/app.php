<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        api: __DIR__ . '/../routes/api.php'
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global Middleware
        $middleware->append(\App\Http\Middleware\RateLimitMiddleware::class);

        // Route Middleware
        $middleware->alias([
            'auth.api_token' => \App\Http\Middleware\AuthenticateApiToken::class,
            'owner' => \App\Http\Middleware\OwnerMiddleware::class,
            'recaptcha'=> \App\Http\Middleware\VerifyReCaptcha::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
