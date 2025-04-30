<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // You can log or report the exception here if needed
        });
    }

    /**
     * Customize the response for unauthenticated requests.
     *
     * This ensures APIs return JSON instead of redirecting to a login route.
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // Return JSON response for API requests
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'You must be logged in to access this resource.',
            ], 401);
        }

        // Default fallback (for web routes, redirects to login)
        return redirect()->guest(route('login'));
    }
}
