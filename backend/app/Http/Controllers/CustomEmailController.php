<?php

namespace App\Http\Controllers;

use App\Mail\CustomEmail;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class CustomEmailController extends Controller
{
    public function sendCustomEmail(Request $request)
    {
        $validated = $request->validate([
            'subscription_list_id' => 'required|exists:subscription_lists,id',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        $subscribers = Subscriber::where('list_id', $validated['subscription_list_id'])
            ->where('status', 'active')
            ->get();


        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new CustomEmail(
                $validated['subject'],
                $validated['body']
            ));
        }

        return response()->json([
            'message' => 'Emails sent successfully.',
            'total_sent' => $subscribers->count(),
        ]);
    }

}
