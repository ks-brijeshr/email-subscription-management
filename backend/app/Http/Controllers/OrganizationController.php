<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\InviteExistingUser;
use App\Mail\InviteNewUser;
use App\Models\OrganizationInvitation;

class OrganizationController extends Controller
{


    public function addUser(Request $request, Organization $organization)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,viewer,member',
        ]);

        $email = $request->email;
        $role = $request->role;
        $token = Str::random(40);
        $organizationName = $organization->name;

        // Check if user exists
        $user = User::where('email', $email)->first();

        if ($user) {
            // Check if already a member
            if ($organization->users()->where('user_id', $user->id)->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User is already a member of this organization.',
                ], 400);
            }

            OrganizationInvitation::create([
                'email' => $email,
                'organization_id' => $organization->id,
                'role' => $role,
                'token' => $token,
                'status' => 'pending',
            ]);

            // Send invite to existing user
            Mail::to($email)->send(new InviteExistingUser($email, $role, $token, $organizationName));

            return response()->json([
                'status' => 'success',
                'message' => 'Invitation sent to existing user. They must accept the invite.',
            ]);
        } else {
            // Save invitation for new user
            OrganizationInvitation::create([
                'email' => $email,
                'organization_id' => $organization->id,
                'role' => $role,
                'token' => $token,
                'status' => 'pending',
            ]);

            // Send signup invite to new user
            Mail::to($email)->send(new InviteNewUser($email, $organization->id, $role, $token));

            return response()->json([
                'status' => 'success',
                'message' => 'Invitation sent to new user. They must sign up and join.',
            ]);
        }
    }




    public function getUsers(Organization $organization): JsonResponse
    {
        if (Gate::denies('view', $organization)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access.'
            ], 403);
        }

        $users = $organization->users()
            ->select('users.id', 'users.name', 'users.email', 'organization_user.role')
            ->get();

        return response()->json([
            'status' => 'success',
            'members' => $users
        ]);
    }


    public function removeUser(Request $request, $organizationId, $userId)
    {
        $organization = Organization::findOrFail($organizationId);

        // Optional: Check if the authenticated user is the owner/admin
        if ($organization->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Don't allow removing the owner
        if ($organization->user_id == $userId) {
            return response()->json(['message' => 'You cannot remove the organization owner.'], 400);
        }

        // Detach user from organization
        $organization->users()->detach($userId);

        return response()->json(['message' => 'Member removed successfully.']);
    }
}
