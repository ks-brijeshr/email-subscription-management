<?php

namespace App\Http\Controllers;

use App\Mail\CustomEmail;
use App\Models\Subscriber;
use Illuminate\Http\Request;
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
            $unsubscribeLink = url("/unsubscribe/{$subscriber->id}/{$subscriber->unsubscribe_token}");

            Mail::to($subscriber->email)->send(new CustomEmail(
                $validated['subject'],
                $validated['body'],
                $ownerEmail,
                $unsubscribeLink
            ));
        }

        return response()->json([
            'message' => 'Emails sent successfully.',
            'sent_count' => $subscribers->count()
        ]);
    }
}
