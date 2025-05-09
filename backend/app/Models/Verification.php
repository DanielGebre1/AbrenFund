<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'document_type',
        'id_front_path',
        'id_back_path',
        'address_proofs',
        'company_docs',
        'business_licenses',
        'status',
        'rejection_reason',
        'processed_at'
    ];

    protected $casts = [
        'address_proofs' => 'array',
        'company_docs' => 'array',
        'business_licenses' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
