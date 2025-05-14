<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ProposalController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ==================== PUBLIC ROUTES ====================

// Authentication
Route::post('/register', [AuthController::class, 'register'])
    ->name('api.register');

Route::post('/login', [AuthController::class, 'login'])
    ->name('api.login');

// Password Reset
Route::post('/password/email', [PasswordResetController::class, 'sendResetLink'])
    ->name('api.password.email');

Route::post('/password/reset', [PasswordResetController::class, 'resetPassword'])
    ->name('api.password.reset');

Route::get('/verify-reset-token', [PasswordResetController::class, 'verifyToken'])
    ->name('api.password.verify-token');

// Test Route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'operational',
        'timestamp' => now()->toDateTimeString()
    ]);
})->name('api.test');

// ==================== AUTHENTICATED ROUTES ====================
Route::middleware('auth:sanctum')->group(function () {

    // Email Verification
    Route::get('/email/verify', function (Request $request) {
        return $request->user()->hasVerifiedEmail()
            ? response()->json(['message' => 'Email already verified'])
            : response()->json(['message' => 'Email not verified'], 403);
    })->name('api.verification.notice');

    Route::post('/email/verification-notification', function (Request $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent']);
    })->middleware('throttle:6,1')->name('api.verification.send');

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('api.logout');

    Route::get('/me', function (Request $request) {
        return response()->json([
            'user' => $request->user()->only([
                'id', 'name', 'email', 'is_verified', 'email_verified_at', 'role'
            ])
        ]);
    })->name('api.user.profile');

    // Profile Management
    Route::prefix('profile')->group(function () {
        Route::put('/', [ProfileController::class, 'updateProfile'])
            ->name('api.profile.update');
        Route::post('/upload-avatar', [ProfileController::class, 'uploadAvatar'])
            ->name('api.profile.upload-avatar');
    });

    // Identity Verification
    Route::prefix('verification')->group(function () {
        Route::post('/submit', [VerificationController::class, 'submitVerification'])
            ->name('api.verification.submit');
        Route::get('/status', [VerificationController::class, 'getVerificationStatus'])
            ->name('api.verification.status');
    });

    // Campaigns
    Route::prefix('campaigns')->group(function () {
        Route::get('/check-verification', [CampaignController::class, 'checkVerification'])
            ->name('api.campaigns.check-verification');
        Route::get('/', [CampaignController::class, 'index'])
            ->name('api.campaigns.index');
        Route::post('/', [CampaignController::class, 'store'])
            ->middleware('verified')
            ->name('api.campaigns.store');
        Route::get('/{id}', [CampaignController::class, 'show'])
            ->name('api.campaigns.show');
        Route::put('/{id}', [CampaignController::class, 'update'])
            ->name('api.campaigns.update');
        Route::delete('/{id}', [CampaignController::class, 'destroy'])
            ->name('api.campaigns.destroy');

        // Proposals for challenges
        Route::prefix('{campaign}/proposals')->group(function () {
            Route::get('/', [ProposalController::class, 'index'])
                ->name('api.campaigns.proposals.index');
            Route::post('/', [ProposalController::class, 'store'])
                ->middleware('verified')
                ->name('api.campaigns.proposals.store');
        });
    });

    // Proposals (direct access)
    Route::prefix('proposals')->group(function () {
        Route::get('/{id}', [ProposalController::class, 'show'])
            ->name('api.proposals.show');
        Route::put('/{id}', [ProposalController::class, 'update'])
            ->name('api.proposals.update');
        Route::delete('/{id}', [ProposalController::class, 'destroy'])
            ->name('api.proposals.destroy');
        Route::put('/{id}/status', [ProposalController::class, 'updateStatus'])
            ->name('api.proposals.status.update');
    });

    // ==================== ADMIN ROUTES (no middleware) ====================

    // User Management
    Route::prefix('admin/users')->group(function () {
        Route::get('/', [UserController::class, 'index'])
            ->name('api.admin.users.index');
        Route::post('/', [UserController::class, 'store'])
            ->name('api.admin.users.store');
        Route::put('/{id}', [UserController::class, 'update'])
            ->name('api.admin.users.update');
        Route::delete('/{id}', [UserController::class, 'destroy'])
            ->name('api.admin.users.destroy');
    });

    // Verifications Management
    Route::prefix('admin/verifications')->group(function () {
        Route::get('/', [VerificationController::class, 'index'])
            ->name('api.admin.verifications.index');
        Route::get('/{verification}', [VerificationController::class, 'show'])
            ->name('api.admin.verifications.show');
        Route::put('/{verification}/approve', [VerificationController::class, 'approve'])
            ->name('api.admin.verifications.approve');
        Route::put('/{verification}/reject', [VerificationController::class, 'reject'])
            ->name('api.admin.verifications.reject');
    });

    // Admin Dashboard
    Route::get('/admin/dashboard', [CampaignController::class, 'adminDashboard'])
        ->name('api.admin.dashboard');

    // Admin Campaign Management
    Route::prefix('admin/campaigns')->group(function () {
        Route::put('/{id}/status', [CampaignController::class, 'updateStatus'])
            ->name('api.admin.campaigns.status.update');
    });

    // ==================== MODERATOR ROUTES (no middleware) ====================

    Route::prefix('moderator/verifications')->group(function () {
        Route::get('/', [VerificationController::class, 'index'])
            ->name('api.moderator.verifications.index');
        Route::get('/{verification}', [VerificationController::class, 'show'])
            ->name('api.moderator.verifications.show');
        Route::put('/{verification}/approve', [VerificationController::class, 'approve'])
            ->name('api.moderator.verifications.approve');
        Route::put('/{verification}/reject', [VerificationController::class, 'reject'])
            ->name('api.moderator.verifications.reject');
    });
});

// ==================== VERIFIED USER ROUTES ====================
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/protected', function () {
        return response()->json([
            'message' => 'You are verified and authenticated!',
            'status' => 'verified'
        ]);
    })->name('api.verified');
});
