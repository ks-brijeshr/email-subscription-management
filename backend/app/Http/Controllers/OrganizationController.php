<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{


    public function addUser(Request $request, Organization $organization)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:admin,viewer',
        ]);

        // Check if the user exists
        $user = User::where('email', $request->email)->first();

        // Check if user already in org
        if ($organization->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'User is already a member of this organization.',
            ], 400);
        }

        // Attach user with selected role
        $organization->users()->attach($user->id, ['role' => $request->role]);

        return response()->json([
            'status' => 'success',
            'message' => 'User added to organization successfully.',
            'user' => $user,
        ]);
    }
}
