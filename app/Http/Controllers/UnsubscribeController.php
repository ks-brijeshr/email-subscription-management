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

    /**
     * Show the unsubscribe confirmation page.
     */
    public function showUnsubscribePage($subscriberId, $token)
    {
        // dd("Subscriber ID: $subscriberId", "Token: $token");

        $subscriber = Subscriber::where('id', $subscriberId)
            ->where('unsubscribe_token', $token)
            ->first();

        if (!$subscriber) {
            abort(404, 'Invalid or expired unsubscribe link.');
        }

        return view('unsubscribe.confirm', compact('subscriber', 'token'));
    }


    /**
     * Handle the unsubscribe confirmation.
     */
    public function confirmUnsubscribe(Request $request, $subscriberId, $token)
    {
        $subscriber = Subscriber::where('id', $subscriberId)
            ->where('unsubscribe_token', $token)
            ->first();

        if (!$subscriber) {
            abort(410, 'Invalid or expired unsubscribe link.');
        }

        // Unsubscribe the user but KEEP the token to prevent expiration issues
        $subscriber->status = 'inactive';
        $subscriber->save();

        return redirect()->route('unsubscribe.success');
    }


    /**
     * Show unsubscribe success page.
     */
    public function unsubscribeSuccess()
    {
        return view('unsubscribe.success');
    }
}
