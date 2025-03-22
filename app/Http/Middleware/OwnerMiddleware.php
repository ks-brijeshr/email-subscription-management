<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SubscriptionList;
use App\Models\Subscriber;

class OwnerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user || !$user->is_owner) {
            return response()->json(['error' => 'Unauthorized. Owners only.'], 403);
        }

        // Check if the user owns the requested subscription list
        if ($subscriptionListId = $request->route('subscription_list')) {
            $subscriptionList = SubscriptionList::where('id', $subscriptionListId)
                ->where('user_id', $user->id)
                ->first();

            if (!$subscriptionList) {
                return response()->json(['error' => 'Unauthorized. You do not own this subscription list.'], 403);
            }
        }

        // Check if the subscriber belongs to a subscription list owned by the user
        if ($subscriberId = $request->route('subscriber_id')) {
            $subscriber = Subscriber::where('id', $subscriberId)
                ->with('subscriptionList') // Eager load the subscription list
                ->first();

            if (!$subscriber) {
                return response()->json(['error' => 'Subscriber not found.'], 404);
            }

            // Ensure the correct column `list_id` is used
            if (!$subscriber->subscriptionList || $subscriber->subscriptionList->user_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized. You do not own this subscriber.'], 403);
            }
        }

        return $next($request);
    }
}
