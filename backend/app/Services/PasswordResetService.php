<?php

namespace App\Services;

use App\Models\User;
use App\Models\PasswordResetToken;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Mail\PasswordResetMail;
use App\Mail\PasswordChangedNotification;
use Illuminate\Support\Facades\Log;

class PasswordResetService
{
    /**
     * Send password reset link to user's email
     *
     * @param string $email
     * @return bool
     */
    public function sendResetLink(string $email): bool
    {
        try {
            $user = User::where('email', $email)->first();

            if (!$user) {
                // Security: Don't reveal if user exists
                return true;
            }

            // Delete existing tokens for this email
            PasswordResetToken::where('email', $email)->delete();

            // Create a new token
            $token = Str::random(64);

            PasswordResetToken::create([
                'email' => $email,
                'token' => Hash::make($token),
                'expires_at' => Carbon::now()->addMinutes(config('auth.passwords.users.expire', 60)),
            ]);

            // Construct reset URL
            $resetUrl = config('app.frontend_url') . "/reset-password?" . http_build_query([
                'token' => $token,
                'email' => $email
            ]);

            // Send reset email
            Mail::to($user->email)->send(new PasswordResetMail($resetUrl));

            Log::channel('auth')->info('Password reset link generated', [
                'email' => $email,
                'token_created_at' => now()
            ]);

            return true;

        } catch (\Exception $e) {
            Log::channel('auth')->error('Failed to send password reset link', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Reset user's password
     *
     * @param string $email
     * @param string $token
     * @param string $password
     * @return bool
     */
    public function resetPassword(string $email, string $token, string $password): bool
    {
        try {
            $user = User::where('email', $email)->first();
            if (!$user) {
                Log::channel('auth')->warning('Password reset attempt for non-existent user', [
                    'email' => $email
                ]);
                return false;
            }

            $record = PasswordResetToken::where('email', $email)
                ->latest('created_at')
                ->first();

            if (!$record) {
                Log::channel('auth')->warning('No password reset token found', [
                    'email' => $email
                ]);
                return false;
            }

            if (!Hash::check($token, $record->token)) {
                Log::channel('auth')->warning('Invalid password reset token', [
                    'email' => $email
                ]);
                return false;
            }

            if ($record->expires_at->isPast()) {
                Log::channel('auth')->warning('Expired password reset token', [
                    'email' => $email,
                    'expired_at' => $record->expires_at
                ]);
                return false;
            }

            // Update password
            $user->password = Hash::make($password);
            $user->save();

            // Delete used tokens
            PasswordResetToken::where('email', $email)->delete();

            // Send notification
            Mail::to($user->email)->send(new PasswordChangedNotification());

            Log::channel('auth')->info('Password reset successful', [
                'email' => $email,
                'reset_at' => now()
            ]);

            return true;

        } catch (\Exception $e) {
            Log::channel('auth')->error('Password reset failed', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}