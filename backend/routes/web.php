<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Http\Controllers\Auth\PasswordResetController;

/*
|--------------------------------------------------------------------------
| Web Routes for Email Verification
|--------------------------------------------------------------------------
*/

$frontend = env('FRONTEND_URL', 'http://localhost:5173');

// Home → forward to SPA root
Route::get('/', function () use ($frontend) {
    return Redirect::to($frontend);
})->name('home');

// Dummy login → forward to SPA login
Route::get('/login', function () use ($frontend) {
    return Redirect::to($frontend . '/login');
})->name('login');

// Verification notice → only authenticated users see the notice
Route::get('/email/verify', function () use ($frontend) {
    return Redirect::to($frontend . '/verify-notice');
})->middleware('auth')->name('verification.notice');

// Signed verification link → validate via middleware, then verify & redirect
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) use ($frontend) {
    Log::info("Verify link hit for ID {$id}, hash {$hash}");

    // 1) Find the user
    $user = User::find($id);
    if (! $user) {
        Log::warning("User not found: {$id}");
        abort(404, 'User not found.');
    }

    // 2) Log the incoming values for debugging
    Log::info("Received ID: {$id}");
    Log::info("Received Hash: {$hash}");

    // 3) Verify email hash matches Laravel’s default
    $expected = sha1($user->getEmailForVerification());
    Log::info("Expected Hash: {$expected}");

    if (! hash_equals($expected, (string) $hash)) {
        Log::warning("Hash mismatch for user {$id}: expected {$expected}, got {$hash}");
        abort(403, 'Invalid verification data.');
    }

    // 4) Mark as verified if not already
    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new \Illuminate\Auth\Events\Verified($user));
        Log::info("User {$id} marked as verified");

        // Redirect after successful verification
        return Redirect::to(rtrim($frontend, '/') . '/emailverifycallback?status=verified');
    } else {
        Log::info("User {$id} already verified at {$user->email_verified_at}");

        // Redirect if already verified
        return Redirect::to(rtrim($frontend, '/') . '/emailverifycallback?status=already_verified');
    }
})
->middleware('signed') // only signature validation here
->name('verification.verify');

// Logout (session) → then forward to SPA
Route::post('/logout', function () use ($frontend) {
    auth()->logout();
    return Redirect::to($frontend);
})->middleware('auth')->name('logout');
