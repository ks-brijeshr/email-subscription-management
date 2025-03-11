<?php

namespace App\Services;

use App\Models\SubscriptionList;
use Illuminate\Support\Facades\Auth;

class SubscriptionListService
{
    /**
     * Get all subscription lists for the authenticated user
     */
    public function getAllSubscriptionLists()
    {
        return SubscriptionList::where('user_id', Auth::id())->get();
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
