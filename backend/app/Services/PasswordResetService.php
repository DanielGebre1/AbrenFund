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
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;

class PasswordResetService
{
    // Method to send the reset password link
    public function sendResetLink(string $email): bool
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Don't reveal if user exists
            return true;
        }

        // Delete existing tokens for this email
        PasswordResetToken::where('email', $email)->delete();

        // Create a new token
        $token = Str::random(64);

        PasswordResetToken::create([
            'email' => $email,
            'token' => Hash::make($token),
            'expires_at' => Carbon::now()->addMinutes(60),
        ]);

        // Construct reset URL
        $resetUrl = config('app.frontend_url') . "/reset-password?token={$token}&email={$email}";

        // Send reset email
        Mail::to($user->email)->send(new PasswordResetMail($resetUrl));

        return true;
    }

    // Method to reset the password
    public function resetPassword(string $email, string $token, string $password): bool
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            return false;
        }

        $record = PasswordResetToken::where('email', $email)->latest('created_at')->first();

        if (
            !$record ||
            !Hash::check($token, $record->token) ||
            $record->expires_at->isPast()
        ) {
            return false;
        }

        // Update password
        $user->password = bcrypt($password);
        $user->save();

        // Delete used tokens
        PasswordResetToken::where('email', $email)->delete();

        // Send notification
        Mail::to($user->email)->send(new PasswordChangedNotification());

        return true;
    }
}
