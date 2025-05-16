<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Campaign;
use Carbon\Carbon;

class CheckCompletedChallenges extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'challenges:check-completed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for challenges whose submission deadline has passed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
           Campaign::where('type', 'challenge')
            ->where('status', 'active')
            ->where('submission_deadline', '<=', Carbon::now())
            ->update(['status' => 'completed']);
            
        $this->info('Completed challenges updated successfully.');
    }
}
