<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Organization;

class OrganizationPolicy
{
    /**
     * Determine whether the user can view the organization.
     */
    public function view(User $user, Organization $organization): bool
    {
        // Allow if the user belongs to this organization
        return $organization->users->contains($user);
    }

    /**
     * Determine whether the user can add members to the organization.
     */
    public function addMember(User $user, Organization $organization): bool
    {
        // You can adjust this logic based on roles
        $member = $organization->users()->where('user_id', $user->id)->first();
        
        return $member && $member->pivot->role === 'admin';
    }

    /**
     * Determine whether the user can update the organization.
     */
    public function update(User $user, Organization $organization): bool
    {
        return $organization->users->contains($user);
    }

    /**
     * Determine whether the user can delete the organization.
     */
    public function delete(User $user, Organization $organization): bool
    {
        return $organization->users->contains($user);
    }
}
