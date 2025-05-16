<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Campaign;

class AppServiceProvider extends ServiceProvider
{

    protected $policies = [
        Verification::class => VerificationPolicy::class,
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         Campaign::observe(\App\Observers\CampaignObserver::class);
    }
}
