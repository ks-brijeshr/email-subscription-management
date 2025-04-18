<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionList;
use App\Models\Subscriber;

class SubscriberListController extends Controller
{
    public function getSubscribersByList($list_id)
    {
        // Eager load subscribers with their tags
        $subscriptionList = SubscriptionList::with(['subscribers.tags'])->find($list_id);
    
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
                    'status' => $subscriber->status,
                    'subscribed_at' => $subscriber->subscribed_at,
                    'created_at' => $subscriber->created_at,
                    'updated_at' => $subscriber->updated_at,
                    'tags' => $subscriber->tags->pluck('tag'), // Just return tag names
                    // Or use ->map(fn($tag) => ['id' => $tag->id, 'tag' => $tag->tag]) if ID needed
                ];
            }),
        ]);
    }
    
}
