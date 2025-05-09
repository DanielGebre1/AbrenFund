<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Verification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    // User submits verification documents
    public function submitVerification(Request $request)
    {
        $user = Auth::user();
        
        // Validate request
        $request->validate([
            'type' => 'required|in:individual,company',
            'document_type' => 'required_if:type,individual',
            'id_front' => 'required_if:type,individual|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'id_back' => 'required_if:type,individual|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'address_proofs' => 'required_if:type,individual|array',
            'address_proofs.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
            'company_docs' => 'required_if:type,company|array',
            'company_docs.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
            'business_licenses' => 'required_if:type,company|array',
            'business_licenses.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        try {
            // Store files and get paths
            $data = [
                'user_id' => $user->id,
                'type' => $request->type,
                'status' => 'pending',
            ];

            if ($request->type === 'individual') {
                $data['document_type'] = $request->document_type;
                $data['id_front_path'] = $this->storeFile($request->file('id_front'), 'verifications');
                $data['id_back_path'] = $this->storeFile($request->file('id_back'), 'verifications');
                
                $addressProofs = [];
                foreach ($request->file('address_proofs') as $file) {
                    $addressProofs[] = $this->storeFile($file, 'verifications/address_proofs');
                }
                $data['address_proofs'] = json_encode($addressProofs);
            } else {
                $companyDocs = [];
                foreach ($request->file('company_docs') as $file) {
                    $companyDocs[] = $this->storeFile($file, 'verifications/company_docs');
                }
                $data['company_docs'] = json_encode($companyDocs);
                
                $businessLicenses = [];
                foreach ($request->file('business_licenses') as $file) {
                    $businessLicenses[] = $this->storeFile($file, 'verifications/business_licenses');
                }
                $data['business_licenses'] = json_encode($businessLicenses);
            }

            // Create or update verification record
            Verification::updateOrCreate(
                ['user_id' => $user->id],
                $data
            );

            return response()->json([
                'message' => 'Verification submitted successfully',
                'status' => 'pending'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error submitting verification: ' . $e->getMessage()
            ], 500);
        }
    }

    // User checks their verification status
    public function getVerificationStatus()
    {
        $verification = Auth::user()->verification;
        
        if (!$verification) {
            return response()->json([
                'status' => 'not_submitted'
            ]);
        }

        return response()->json([
            'status' => $verification->status,
            'type' => $verification->type,
            'submitted_at' => $verification->created_at,
            'processed_at' => $verification->processed_at,
            'rejection_reason' => $verification->rejection_reason,
        ]);
    }

    // Admin/Moderator lists pending verifications
    public function index(Request $request)
    {
        $this->authorize('viewAny', Verification::class);

        $query = Verification::with(['user' => function($query) {
            $query->select('id', 'name', 'email');
        }]);

        $query = Verification::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'pending');
        }

        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return $query->orderBy('created_at', 'desc')
                ->paginate($request->input('per_page', 10));
    }

    // Admin/Moderator views verification details
    public function show(Verification $verification)
    {
        $this->authorize('view', $verification);
        
        return $verification->load('user');
    }

    // Admin/Moderator approves verification
    public function approve(Verification $verification)
    {
        $this->authorize('approve', $verification);
        
        $verification->update([
            'status' => 'approved',
            'processed_at' => now(),
            'rejection_reason' => null,
        ]);

        // You might want to add additional actions here, like:
        // - Send approval notification to user
        // - Update user's verification status

        return response()->json([
            'message' => 'Verification approved successfully',
            'verification' => $verification->fresh()
        ]);
    }

    // Admin/Moderator rejects verification
    public function reject(Request $request, Verification $verification)
    {
        $this->authorize('reject', $verification);
        
        $request->validate([
            'reason' => 'required|string|min:10|max:500'
        ]);

        $verification->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
            'processed_at' => now(),
        ]);

        // You might want to add additional actions here, like:
        // - Send rejection notification to user with reason
        // - Clear previously uploaded documents if needed

        return response()->json([
            'message' => 'Verification rejected successfully',
            'verification' => $verification->fresh()
        ]);
    }

    // Helper method to store files
    private function storeFile($file, $directory)
    {
        $filename = Str::random(20) . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, 'public');
        return $path;
    }

    // Helper method to delete files when verification is deleted
    private function deleteVerificationFiles(Verification $verification)
    {
        try {
            if ($verification->id_front_path) {
                Storage::disk('public')->delete($verification->id_front_path);
            }
            if ($verification->id_back_path) {
                Storage::disk('public')->delete($verification->id_back_path);
            }
            if ($verification->address_proofs) {
                foreach (json_decode($verification->address_proofs) as $file) {
                    Storage::disk('public')->delete($file);
                }
            }
            if ($verification->company_docs) {
                foreach (json_decode($verification->company_docs) as $file) {
                    Storage::disk('public')->delete($file);
                }
            }
            if ($verification->business_licenses) {
                foreach (json_decode($verification->business_licenses) as $file) {
                    Storage::disk('public')->delete($file);
                }
            }
            return true;
        } catch (\Exception $e) {
            report($e);
            return false;
        }
    }
}