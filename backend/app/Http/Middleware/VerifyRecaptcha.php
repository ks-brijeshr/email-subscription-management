<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class VerifyReCaptcha
{
    public function handle(Request $request, Closure $next): Response
    {
        $recaptchaResponse = $request->input('recaptcha_token');

        // Bypass reCAPTCHA if a test token is used remove it whne frontend is ready
        if ($recaptchaResponse === 'test-token') {
            return $next($request);
        }



        if (!$recaptchaResponse) {
            return response()->json(['error' => 'reCAPTCHA token is missing'], 422);
        }

        // Verify reCAPTCHA with Google API
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => config('services.recaptcha.secret'),
            'response' => $recaptchaResponse,
            'remoteip' => $request->ip(),
        ]);

        $body = $response->json();

        if (!$body['success']) {
            return response()->json(['error' => 'reCAPTCHA validation failed'], 422);
        }

        return $next($request);
    }
}
