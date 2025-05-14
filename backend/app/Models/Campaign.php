<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'title', 'short_description', 'full_description',
        'category', 'funding_goal', 'reward_amount', 'end_date', 'submission_deadline',
        'expected_delivery_date', 'funding_type', 'eligibility_criteria', 'project_scope',
        'company_name', 'company_description', 'contact_email', 'thumbnail_path', 'status'
    ];

       protected $casts = [
        'end_date' => 'date',
        'submission_deadline' => 'date',
        'expected_delivery_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(CampaignImage::class);
    }

     public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }


     public function isProject()
    {
        return $this->type === 'project';
    }

    public function isChallenge()
    {
        return $this->type === 'challenge';
    }

    // Helper method to get the award amount for challenges
    public function getAwardAttribute()
    {
        return $this->isChallenge() ? $this->reward_amount : null;
    }

    // Helper method to get submissions count for challenges
    public function getSubmissionsCountAttribute()
    {
        return $this->isChallenge() ? $this->proposals()->count() : 0;
    }

    public function acceptsSubmissions()
{
    return $this->status === 'approved' && 
           $this->submission_deadline && 
           now()->lt($this->submission_deadline);
}

}
