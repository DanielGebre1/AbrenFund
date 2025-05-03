<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;  // Added proper import
use App\Models\PasswordResetToken;  // Added proper import
use App\Services\PasswordResetService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class PasswordResetController extends Controller
{
    protected $passwordResetService;

    public function __construct(PasswordResetService $passwordResetService)
    {
        $this->passwordResetService = $passwordResetService;
    }

    /**
     * Send password reset link
     */
    public function sendResetLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $email = $request->input('email');
            $success = $this->passwordResetService->sendResetLink($email);

            return response()->json([
                'success' => $success,
                'message' => $success 
                    ? 'If the email is associated with an account, a password reset link has been sent.'
                    : 'Failed to send password reset link. Please try again later.'
            ], $success ? 200 : 500);

        } catch (\Exception $e) {
            Log::channel('auth')->error('Password reset link endpoint error', [
                'email' => $request->input('email'),
                'error' => $e->getMessage(),
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    /**
     * Verify password reset token
     */
    public function verifyToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'valid' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $email = $request->input('email');
            $token = $request->input('token');

            $user = User::where('email', $email)->first();
            if (!$user) {
                return response()->json([
                    'valid' => false,
                    'message' => 'No account found with this email.'
                ], 404);
            }

            $record = PasswordResetToken::where('email', $email)
                ->latest('created_at')
                ->first();

            if (!$record) {
                return response()->json([
                    'valid' => false,
                    'message' => 'No password reset request found for this email.'
                ], 404);
            }

            if (!Hash::check($token, $record->token)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Invalid reset token.'
                ], 400);
            }

            if ($record->expires_at->isPast()) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Reset token has expired. Please request a new one.'
                ], 400);
            }

            return response()->json([
                'valid' => true,
                'message' => 'Token is valid',
                'expires_at' => $record->expires_at
            ]);

        } catch (\Exception $e) {
            Log::channel('auth')->error('Token verification error', [
                'email' => $request->input('email'),
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
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $success = $this->passwordResetService->resetPassword(
                $request->input('email'),
                $request->input('token'),
                $request->input('password')
            );

            return response()->json([
                'success' => $success,
                'message' => $success 
                    ? 'Password has been reset successfully.'
                    : 'Invalid token or password reset failed.'
            ], $success ? 200 : 400);

        } catch (\Exception $e) {
            Log::channel('auth')->error('Password reset endpoint error', [
                'email' => $request->input('email'),
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