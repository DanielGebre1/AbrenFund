<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\PasswordResetService;
use Illuminate\Http\Request;
use App\Models\PasswordResetToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    protected $passwordResetService;

    public function __construct(PasswordResetService $passwordResetService)
    {
        $this->passwordResetService = $passwordResetService;
    }

    /**
     * Send password reset link to user's email
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        try {
            $email = $request->input('email');
            $this->passwordResetService->sendResetLink($email);

            Log::channel('auth')->info('Password reset link sent', [
                'email' => $email,
                'ip' => $request->ip(),
                'timestamp' => now()->toDateTimeString()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'If the email is associated with an account, a password reset link has been sent.'
            ], 200);

        } catch (\Exception $e) {
            Log::channel('auth')->error('Password reset link failed', [
                'email' => $request->input('email'),
                'error' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process password reset request. Please try again later.'
            ], 500);
        }
    }

    /**
     * Verify password reset token
     */
    public function verifyToken(Request $request)
    {
       
        $request->validate([
            'email' => 'required|email|max:255',
            'token' => 'required|string',
        ]);

        try {
            $record = PasswordResetToken::where('email', $request->email)->first();

            if (!$record) {
                Log::channel('auth')->warning('Password reset token verification failed - no record', [
                    'email' => $request->email,
                    'ip' => $request->ip()
                ]);
                return response()->json([
                    'valid' => false,
                    'message' => 'No password reset request found for this email.'
                ], 404);
            }

            if (!Hash::check($request->token, $record->token)) {
                Log::channel('auth')->warning('Password reset token verification failed - invalid token', [
                    'email' => $request->email,
                    'ip' => $request->ip()
                ]);
                return response()->json([
                    'valid' => false,
                    'message' => 'Invalid reset token.'
                ], 400);
            }

            if ($record->expires_at->isPast()) {
                Log::channel('auth')->warning('Password reset token verification failed - expired token', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                    'expired_at' => $record->expires_at
                ]);
                return response()->json([
                    'valid' => false,
                    'message' => 'Reset token has expired. Please request a new one.'
                ], 400);
            }

            return response()->json([
                'valid' => true,
                'message' => 'Token is valid',
                'expires_at' => $record->expires_at
            ], 200);

        } catch (\Exception $e) {
            Log::channel('auth')->error('Password reset token verification error', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'valid' => false,
                'message' => 'An error occurred while verifying the reset token.'
            ], 500);
        }
    }

    /**
     * Reset user's password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed|max:255',
        ]);

        try {
            $resetSuccess = $this->passwordResetService->resetPassword(
                $request->email,
                $request->token,
                $request->password
            );

            if ($resetSuccess) {
                Log::channel('auth')->info('Password reset successful', [
                    'email' => $request->email,
                    'ip' => $request->ip()
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Password has been reset successfully.'
                ], 200);
            }

            Log::channel('auth')->warning('Password reset failed', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid token or password reset failed.'
            ], 400);

        } catch (\Exception $e) {
            Log::channel('auth')->error('Password reset error', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while resetting the password.'
            ], 500);
        }
    }
}