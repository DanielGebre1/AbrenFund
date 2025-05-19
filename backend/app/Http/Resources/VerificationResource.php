<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
            'type' => $this->type,
            'status' => $this->status,
            'document_type' => $this->document_type,
            'created_at' => $this->created_at,
            'rejection_reason' => $this->rejection_reason,
            'id_front_url' => $this->id_front_path ? Storage::url($this->id_front_path) : null,
            'id_back_url' => $this->id_back_path ? Storage::url($this->id_back_path) : null,
            'address_proof_urls' => array_map([Storage::class, 'url'], $this->address_proofs ?? []),
            'company_docs_urls' => array_map([Storage::class, 'url'], $this->company_docs ?? []),
            'business_licenses_urls' => array_map([Storage::class, 'url'], $this->business_licenses ?? []),
        ];
    }
}
