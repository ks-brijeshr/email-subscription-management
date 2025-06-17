<?php

namespace App\Http\Controllers;

use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Http\Request;

class InvitationController extends Controller
{

    public function accept($token)
    {
        $invite = OrganizationInvitation::where('token', $token)->first();

        if (!$invite) {
            return response()->json(['message' => 'Invalid or expired invitation token.'], 404);
        }

        if ($invite->accepted_at) {
            return response()->json(['message' => 'Invitation already accepted.'], 400);
        }

        $user = User::where('email', $invite->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No user found. Please sign up first.'], 404);
        }

        // Attach user to the organization
        $invite->organization->users()->attach($user->id, ['role' => $invite->role]);

        $invite->accepted_at = now();
        $invite->status = 'accepted';
        $invite->save();

        return response()->json(['message' => 'You have successfully joined the organization.']);
    }
}
