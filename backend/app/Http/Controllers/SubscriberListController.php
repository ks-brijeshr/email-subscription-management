<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionList;
use App\Models\Subscriber;

class SubscriberListController extends Controller
{
    public function getSubscribersByList($list_id)
    {
        // Fetch the subscription list
        $subscriptionList = SubscriptionList::with('subscribers')->find($list_id);

        // Check if the list exists
        if (!$subscriptionList) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription list not found.'
            ], 404);
        }

        
        return response()->json([
            'success' => true,
            'list_name' => $subscriptionList->name,
            'subscribers' => $subscriptionList->subscribers->map(function ($subscriber) {
                return [
                    'id' => $subscriber->id,
                    'list_id' => $subscriber->list_id,
                    'name' => $subscriber->name,
                    'email' => $subscriber->email,
                    'subscribed_at' => $subscriber->subscribed_at,
                    'created_at' => $subscriber->created_at,
                    'updated_at' => $subscriber->updated_at,
                ];
            })
        ]);
    }
}
