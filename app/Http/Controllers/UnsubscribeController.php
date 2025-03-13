<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UnsubscribeController extends Controller
{
    /**
     * Get the unsubscribe link for a subscriber.
     */
    public function getUnsubscribeLink($subscriberId)
    {
        $subscriber = Subscriber::find($subscriberId);

        if (!$subscriber) {
            return response()->json(['message' => 'Subscriber not found'], 404);
        }

        // Ensure the subscriber has a valid unsubscribe token
        if (!$subscriber->unsubscribe_token) {
            $subscriber->unsubscribe_token = Str::random(32);
            $subscriber->save();
        }

        $unsubscribeLink = url("/api/unsubscribe/{$subscriber->id}/{$subscriber->unsubscribe_token}");

        return response()->json([
            'message' => 'Unsubscribe link generated successfully',
            'unsubscribe_link' => $unsubscribeLink
        ]);
    }
}
