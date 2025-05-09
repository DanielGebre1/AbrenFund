<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\VerificationController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ✅ Register (Public)
Route::post('/register', [AuthController::class, 'register']);

// ✅ Login (Public)
Route::post('/login', [AuthController::class, 'login']);

// ✅ Public test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// ✅ Email Verification Routes (callback moved to web.php)
Route::middleware('auth:sanctum')->group(function () {

    // Check if user's email is verified
    Route::get('/email/verify', function (Request $request) {
        return $request->user()->hasVerifiedEmail()
            ? response()->json(['message' => 'Email already verified.'])
            : response()->json(['message' => 'Email not verified.'], 403);
    });

    // Resend verification email (throttled to prevent spam)
    Route::post('/email/verification-notification', function (Request $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent!']);
    })->middleware('throttle:6,1');

    // ✅ Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Get authenticated user info
    Route::get('/me', function (Request $request) {
        return response()->json(['me' => $request->user()]);
    });
});

// ✅ Routes that require both authentication and verified email
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Example protected route
    Route::get('/protected', function () {
        return response()->json(['message' => 'You are verified and authenticated!']);
    });

    // Add more verified-only routes here
});


// Password reset request → forward to SPA

Route::post('/password/email', [\App\Http\Controllers\Auth\PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [\App\Http\Controllers\Auth\PasswordResetController::class, 'resetPassword']);
Route::get('/verify-reset-token', [\App\Http\Controllers\Auth\PasswordResetController::class, 'verifyToken']);


// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->get('/admin-dashboard', [ProjectController::class, 'adminDashboard']);


//Change Profile
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::post('/upload-avatar', [ProfileController::class, 'uploadAvatar']);
});



//admin user
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::post('/users', [UserController::class, 'store']);

//idverification
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/verification/submit', [VerificationController::class, 'submitVerification']);
    Route::get('/verification/status', [VerificationController::class, 'getVerificationStatus']);
});

// Admin endpoints
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/verifications', [VerificationController::class, 'index']);
        Route::get('/verifications/{verification}', [VerificationController::class, 'show']);
        Route::put('/verifications/{verification}/approve', [VerificationController::class, 'approve']);
        Route::put('/verifications/{verification}/reject', [VerificationController::class, 'reject']);
    });
    
    // Moderator endpoints
    Route::middleware(['moderator'])->prefix('moderator')->group(function () {
        Route::get('/verifications', [VerificationController::class, 'index']);
        Route::get('/verifications/{verification}', [VerificationController::class, 'show']);
        Route::put('/verifications/{verification}/approve', [VerificationController::class, 'approve']);
        Route::put('/verifications/{verification}/reject', [VerificationController::class, 'reject']);
    });

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/campaigns', [\App\Http\Controllers\API\CampaignController::class, 'store']);
});
