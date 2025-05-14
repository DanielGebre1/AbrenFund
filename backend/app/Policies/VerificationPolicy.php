<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Verification;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class VerificationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
{
    return $user->role === 'admin' || $user->role === 'moderator';
}


    /**
     * Determine whether the user can view the model.
     */
  public function view(User $user, Verification $verification)
{
    return $user->role === 'admin' || $user->role === 'moderator';
}

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create verification
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Verification $verification): bool
    {
        // Only the owner can update their verification when it's pending
        return $user->id === $verification->user_id && $verification->status === 'pending';
    }

    /**
     * Determine whether the user can approve the verification.
     */
    public function approve(User $user)
{
    return $user->role === 'admin' || $user->role === 'moderator';
}

    /**
     * Determine whether the user can reject the verification.
     */
    public function reject(User $user)
{
    return $user->role === 'admin' || $user->role === 'moderator';
}
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Verification $verification): bool
    {
        // Only admins can delete verifications
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Verification $verification): bool
    {
        // Only admins can restore deleted verifications
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Verification $verification): bool
    {
        // Only admins can permanently delete verifications
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can download verification files.
     */
    public function downloadFiles(User $user, Verification $verification): bool
    {
        // Admins/moderators can download any verification files
        if ($user->isAdmin() || $user->isModerator()) {
            return true;
        }
        
        // Users can only download their own verification files
        return $user->id === $verification->user_id;
    }

    
}