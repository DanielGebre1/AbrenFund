<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSocialProfile extends Model
{
    protected $fillable = [
        'user_id', 'twitter', 'facebook', 'instagram', 'linkedin'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
