<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated and has 'admin' role
        if ($request->user() && $request->user()->role !== 'admin') {
            // If not, return a 403 Forbidden response
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
