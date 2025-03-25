<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailySignup;

class SignupAnalyticsController extends Controller
{
    public function index()
    {
        $signups = DailySignup::orderBy('date', 'desc')->get();

        if ($signups->isEmpty()) {
            return response()->json(['message' => 'No signup data found'], 404);
        }

        return response()->json($signups);
    }
}
