<?php

namespace App\Http\Controllers;

use App\Jobs\SendCustomEmailJob;
use App\Models\Subscriber;
use Illuminate\Http\Request;

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

            dispatch(new SendCustomEmailJob(
                $subscriber->email,
                $validated['subject'],
                $validated['body'],
                $ownerEmail,
                $unsubscribeLink
            ));
        }

        return response()->json([
            'message' => 'Emails queued successfully.',
            'sent_count' => $subscribers->count()
        ]);
    }
}
