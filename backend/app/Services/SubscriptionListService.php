<?php

namespace App\Services;

use App\Models\SubscriptionList;
use Illuminate\Support\Facades\Auth;

class SubscriptionListService
{
    /**
     * Get all subscription lists for the authenticated user with total subscribers count
     */
    public function getAllSubscriptionListsWithCounts($perPage = 10)
    {
        return SubscriptionList::where('user_id', Auth::id())
            ->withCount('subscribers')
            ->paginate($perPage);
    }


    /**
     * Update an existing subscription list
     */
    public function updateSubscriptionList($id, $data)
    {
        $subscriptionList = SubscriptionList::where('id', $id)
            ->where('user_id', Auth::id()) // Ensure user can only update their own lists
            ->first();

        if (!$subscriptionList) {
            return null; // Return null if not found
        }

        $subscriptionList->update($data);
        return $subscriptionList;
    }
}
