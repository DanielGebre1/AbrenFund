<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Verification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class VerificationController extends Controller
{
     use AuthorizesRequests;
    // User submits verification documents
    public function submitVerification(Request $request)
    {
        $user = Auth::user();
        
        // Validate request with improved rules
        $request->validate([
            'type' => ['required', Rule::in(['individual', 'company'])],
            'document_type' => ['required_if:type,individual', Rule::in(['national-id', 'passport', 'drivers-license'])],
            'id_front' => ['required_if:type,individual', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'id_back' => ['required_if:type,individual', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'address_proofs' => ['required_if:type,individual', 'array', 'min:1', 'max:5'],
            'address_proofs.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'company_docs' => ['required_if:type,company', 'array', 'min:1', 'max:5'],
            'company_docs.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'business_licenses' => ['required_if:type,company', 'array', 'min:1', 'max:5'],
            'business_licenses.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        try {
            // Check if user already has approved verification
            $existingVerification = Verification::where('user_id', $user->id)
                ->where('status', 'approved')
                ->first();

            if ($existingVerification) {
                return response()->json([
                    'message' => 'You already have an approved verification',
                    'status' => 'approved'
                ], 400);
            }

            // Prepare data for storage
            $data = [
                'user_id' => $user->id,
                'type' => $request->type,
                'status' => 'pending',
                'document_type' => $request->document_type ?? null,
            ];

            // Handle file storage with transaction for data consistency
            return DB::transaction(function () use ($request, $user, $data) {
                // Delete any previous verification files if they exist
                $previousVerification = Verification::where('user_id', $user->id)->first();
                if ($previousVerification) {
                    $this->deleteVerificationFiles($previousVerification);
                }

                // Store files based on verification type
                if ($request->type === 'individual') {
                    $data['id_front_path'] = $this->storeFile($request->file('id_front'), 'verifications/id_documents');
                    $data['id_back_path'] = $this->storeFile($request->file('id_back'), 'verifications/id_documents');
                    
                    $addressProofs = [];
                    foreach ($request->file('address_proofs') as $file) {
                        $addressProofs[] = $this->storeFile($file, 'verifications/address_proofs');
                    }
                    $data['address_proofs'] = json_encode($addressProofs);
                } else {
                    $companyDocs = [];
                    foreach ($request->file('company_docs') as $file) {
                        $companyDocs[] = $this->storeFile($file, 'verifications/company_documents');
                    }
                    $data['company_docs'] = json_encode($companyDocs);
                    
                    $businessLicenses = [];
                    foreach ($request->file('business_licenses') as $file) {
                        $businessLicenses[] = $this->storeFile($file, 'verifications/business_licenses');
                    }
                    $data['business_licenses'] = json_encode($businessLicenses);
                }

                // Create or update verification record
                $verification = Verification::updateOrCreate(
                    ['user_id' => $user->id],
                    $data
                );

                return response()->json([
                    'message' => 'Verification submitted successfully',
                    'status' => 'pending',
                    'verification_id' => $verification->id
                ], 200);
            });

        } catch (\Exception $e) {
            Log::error('Verification submission failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e
            ]);
            
            return response()->json([
                'message' => 'Error submitting verification. Please try again later.'
            ], 500);
        }
    }

    // User checks their verification status
    public function getVerificationStatus()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $verification = $user->verification;
        
        if (!$verification) {
            return response()->json([
                'status' => 'not_submitted',
                'can_submit' => true
            ]);
        }

        $response = [
            'status' => $verification->status,
            'type' => $verification->type,
            'submitted_at' => $verification->created_at->toIso8601String(),
            'updated_at' => optional($verification->updated_at)->toIso8601String(),
            'can_resubmit' => in_array($verification->status, ['rejected', 'expired']),
        ];

        if ($verification->status === 'rejected') {
            $response['rejection_reason'] = $verification->rejection_reason;
        }

        return response()->json($response);
    }

    // Admin/Moderator lists verifications with filters
    public function index(Request $request)
    {
        $this->authorize('viewAny', Verification::class);

        $query = Verification::with(['user' => function($query) {
            $query->select('id', 'name', 'email', 'created_at');
        }])
        ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        // Pagination with default per_page
        return $query->paginate($request->input('per_page', 15));
    }

    // Admin/Moderator views verification details
    public function show(Verification $verification)
    {
        $this->authorize('view', $verification);
        
        $verification->load(['user' => function($query) {
            $query->select('id', 'name', 'email', 'created_at');
        }]);

        // Prepare file URLs for frontend access
        $verification->id_front_url = $verification->id_front_path ? Storage::url($verification->id_front_path) : null;
        $verification->id_back_url = $verification->id_back_path ? Storage::url($verification->id_back_path) : null;
        
        // Decode JSON arrays and add URLs
        if ($verification->address_proofs) {
            $addressProofs = json_decode($verification->address_proofs);
            $verification->address_proof_urls = array_map(function($path) {
                return Storage::url($path);
            }, $addressProofs);
        }

        if ($verification->company_docs) {
            $companyDocs = json_decode($verification->company_docs);
            $verification->company_docs_urls = array_map(function($path) {
                return Storage::url($path);
            }, $companyDocs);
        }

        if ($verification->business_licenses) {
            $businessLicenses = json_decode($verification->business_licenses);
            $verification->business_licenses_urls = array_map(function($path) {
                return Storage::url($path);
            }, $businessLicenses);
        }

        return response()->json($verification);
    }

    // Admin/Moderator approves verification
    public function approve(Verification $verification)
    {
        $this->authorize('approve', $verification);
        
        try {
            return DB::transaction(function () use ($verification) {
                // Update verification status
                $verification->update([
                    'status' => 'approved',
                    'rejection_reason' => null,
                ]);

                // Update user's verification status
                $verification->user->update([
                    'is_verified' => true,
                    'verification_id' => $verification->id,
                ]);

                return response()->json([
                    'message' => 'Verification approved successfully',
                    'verification' => $verification->fresh()
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Verification approval failed: ' . $e->getMessage(), [
                'verification_id' => $verification->id,
                'exception' => $e
            ]);
            
            return response()->json([
                'message' => 'Failed to approve verification. Please try again.'
            ], 500);
        }
    }

    // Admin/Moderator rejects verification
    public function reject(Request $request, Verification $verification)
    {
        $this->authorize('reject', $verification);
        
        $request->validate([
            'reason' => 'required|string|min:10|max:500'
        ]);

        try {
            return DB::transaction(function () use ($request, $verification) {
                // Update verification status
                $verification->update([
                    'status' => 'rejected',
                    'rejection_reason' => $request->reason,
                ]);

                // Update user's verification status
                $verification->user->update([
                    'is_verified' => false,
                    'verification_id' => null,
                ]);

                return response()->json([
                    'message' => 'Verification rejected successfully',
                    'verification' => $verification->fresh()
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Verification rejection failed: ' . $e->getMessage(), [
                'verification_id' => $verification->id,
                'exception' => $e
            ]);
            
            return response()->json([
                'message' => 'Failed to reject verification. Please try again.'
            ], 500);
        }
    }

    // Helper method to store files with improved naming
    private function storeFile($file, $directory)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . '.' . $extension;
        $path = $file->storeAs($directory, $filename, 'public');
        
        if (!$path) {
            throw new \Exception("Failed to store file in directory: {$directory}");
        }
        
        return $path;
    }

    // Helper method to delete files when verification is deleted/updated
    private function deleteVerificationFiles(Verification $verification)
    {
        try {
            $filesToDelete = [];
            
            if ($verification->id_front_path) {
                $filesToDelete[] = $verification->id_front_path;
            }
            if ($verification->id_back_path) {
                $filesToDelete[] = $verification->id_back_path;
            }
            if ($verification->address_proofs) {
                $filesToDelete = array_merge($filesToDelete, json_decode($verification->address_proofs, true));
            }
            if ($verification->company_docs) {
                $filesToDelete = array_merge($filesToDelete, json_decode($verification->company_docs, true));
            }
            if ($verification->business_licenses) {
                $filesToDelete = array_merge($filesToDelete, json_decode($verification->business_licenses, true));
            }

            Storage::disk('public')->delete($filesToDelete);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to delete verification files: ' . $e->getMessage(), [
                'verification_id' => $verification->id
            ]);
            return false;
        }
    }
}