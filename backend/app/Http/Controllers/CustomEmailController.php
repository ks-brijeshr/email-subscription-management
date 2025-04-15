<?php

namespace App\Http\Controllers;

use App\Mail\CustomEmail;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use App\Models\SubscriptionList;
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

        $subscriptionList = \App\Models\SubscriptionList::findOrFail($validated['subscription_list_id']);
        $ownerEmail = $subscriptionList->owner->email;

        $subscribers = Subscriber::where('list_id', $validated['subscription_list_id'])
            ->where('status', 'active')
            ->get();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new \App\Mail\CustomEmail(
                $validated['subject'],
                $validated['body'],
                $ownerEmail
            ));
        }

        return response()->json([
            'message' => 'Emails sent successfully.',
            'total_sent' => $subscribers->count(),
        ]);
    }


}
