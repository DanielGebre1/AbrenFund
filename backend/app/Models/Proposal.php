<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proposal extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'campaign_id',
        'user_id',
        'title',
        'description',
        'problem_statement',
        'proposed_solution',
        'budget_breakdown',
        'timeline',
        'expected_impact',
        'team_info',
        'status',
        'feedback'
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ProposalMedia::class);
    }
}
