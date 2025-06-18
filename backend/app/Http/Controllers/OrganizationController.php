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
use Illuminate\Support\Facades\Session;

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


    public function updateUserRole(Request $request, Organization $org, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,member,viewer',
        ]);

        // Make sure the user belongs to the organization
        if (!$org->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['status' => 'error', 'message' => 'User does not belong to this organization.'], 403);
        }

        // Prevent changing role of the owner
        if ($user->id === $org->user_id) {
            return response()->json(['status' => 'error', 'message' => 'Cannot change role of organization owner.'], 403);
        }

        // Update the role in the pivot table
        $org->users()->updateExistingPivot($user->id, [
            'role' => $request->role
        ]);

        return response()->json(['status' => 'success', 'message' => 'Role updated successfully.']);
    }

    public function getUserOrganizations()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Owned organizations
        $owned = $user->ownedOrganizations()->get();

        // Member organizations
        $member = $user->organizations()->get();

        // Combine both, remove duplicates
        $allOrganizations = $owned->merge($member)->unique('id')->values();

        return response()->json($allOrganizations);
    }

    /**
     * Set the active organization in the session.
     */
    public function setActiveOrganization(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $orgId = $request->input('organization_id');
        if (!$orgId) {
            return response()->json(['message' => 'Organization ID is required.'], 400);
        }

        // Check if user owns or is a member of the org
        $owns = $user->ownedOrganizations()->where('id', $orgId)->exists();
        $member = $user->organizations()->where('organizations.id', $orgId)->exists();

        if (!$owns && !$member) {
            return response()->json(['message' => 'You do not have access to this organization.'], 403);
        }

        // Set in session
        Session::put('active_organization_id', $orgId);

        return response()->json(['message' => 'Active organization set successfully.']);
    }

    /**
     * Get the currently active organization from the session.
     */
    public function getActiveOrganization()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $orgId = session('active_organization_id');

        if ($orgId) {
            $org = Organization::find($orgId);
            if ($org) return response()->json($org);
        }

        // Fallback: get owned
        $owned = $user->ownedOrganizations()->first();
        if ($owned) {
            session(['active_organization_id' => $owned->id]);
            return response()->json($owned);
        }

        // Fallback: get member
        $member = $user->organizations()->first();
        if ($member) {
            session(['active_organization_id' => $member->id]);
            return response()->json($member);
        }

        return response()->json(['message' => 'No organization found.'], 404);
    }
}
