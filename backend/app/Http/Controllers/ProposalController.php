<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalRequest;
use App\Models\Proposal;
use App\Models\ProposalMedia;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProposalController extends Controller
{
    /**
     * Get paginated list of proposals with filters
     */
    public function index(Request $request, $campaignId = null)
    {
        try {
            $query = Proposal::with(['user:id,name', 'campaign:id,title', 'media'])
                ->whereNull('deleted_at') // Explicitly exclude soft-deleted records
                ->latest();

            // Log initial query count for debugging
            Log::info('Proposal index: Initial query', [
                'count' => $query->count(),
                'user_id' => Auth::id(),
                'campaign_id' => $campaignId,
                'request_params' => $request->all()
            ]);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($campaignId) {
                // Verify the campaign exists and is a challenge
                $campaign = Campaign::findOrFail($campaignId);
                if (!$campaign->isChallenge()) {
                    return response()->json([
                        'message' => 'This campaign is not a challenge'
                    ], 400);
                }
                $query->where('campaign_id', $campaignId);
            } elseif ($request->has('campaign_id')) {
                $query->where('campaign_id', $request->campaign_id);
            }

            // Handle user_id filter - support 'current' keyword for current user
            if ($request->has('user_id')) {
                if ($request->user_id === 'current') {
                    $query->where('user_id', Auth::id());
                } else {
                    $query->where('user_id', $request->user_id);
                }
            }

            // Apply search filter
            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                      ->orWhere('description', 'like', '%'.$request->search.'%')
                      ->orWhereHas('campaign', function($q) use ($request) {
                          $q->where('title', 'like', '%'.$request->search.'%');
                      });
                });
            }

            // Add permission-based filtering
            $user = Auth::user();
            if (!$user->isAdmin() && !$user->isModerator()) {
                // Non-admin/moderator users can only see their own proposals or public ones
                $query->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                      ->orWhereHas('campaign', function ($q) use ($user) {
                          $q->where('user_id', $user->id); // Campaign owner
                      });
                });
            }

            // Log final query count
            Log::info('Proposal index: After filters', [
                'count' => $query->count(),
                'filters' => [
                    'status' => $request->status,
                    'campaign_id' => $campaignId ?? $request->campaign_id,
                    'user_id' => $request->user_id,
                    'search' => $request->search
                ]
            ]);

            $perPage = $request->input('per_page', 10);
            $proposals = $query->paginate($perPage);

            // Append full media URLs and normalize status
            $proposals->getCollection()->transform(function ($proposal) {
                $this->appendMediaUrls($proposal);
                $proposal->status = $this->normalizeStatus($proposal->status);
                return $proposal;
            });

            return response()->json([
                'data' => $proposals,
                'message' => 'Proposals retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve proposals: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'campaign_id' => $campaignId,
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to retrieve proposals',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Store a newly created proposal with media handling
     */
    public function store(StoreProposalRequest $request, $campaignId = null)
    {
        try {
            return DB::transaction(function () use ($request, $campaignId) {
                $user = Auth::user();
                $data = $request->validated();
                $data['user_id'] = $user->id;

                // Determine campaign ID
                $finalCampaignId = $campaignId ?? $request->campaign_id;
                if (!$finalCampaignId) {
                    return response()->json([
                        'message' => 'Campaign ID is required'
                    ], 400);
                }

                // Verify campaign exists and is an active challenge
                $campaign = Campaign::findOrFail($finalCampaignId);
                if (!$campaign->isChallenge()) {
                    return response()->json([
                        'message' => 'This campaign is not a challenge'
                    ], 400);
                }

                if (!$campaign->acceptsSubmissions()) {
                    return response()->json([
                        'message' => 'This challenge is not currently accepting submissions'
                    ], 400);
                }

                $data['campaign_id'] = $finalCampaignId;

                // Create the proposal
                $proposal = Proposal::create([
                    'campaign_id' => $finalCampaignId,
                    'user_id' => $user->id,
                    'title' => $request->title,
                    'description' => $request->description,
                    'problem_statement' => $request->problem_statement,
                    'proposed_solution' => $request->proposed_solution,
                    'budget_breakdown' => $request->budget_breakdown,
                    'timeline' => $request->timeline,
                    'expected_impact' => $request->expected_impact,
                    'team_info' => $request->team_info,
                    'status' => 'pending'
                ]);

                // Handle images upload
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $this->storeProposalFile($image, 'images');
                        ProposalMedia::create([
                            'proposal_id' => $proposal->id,
                            'path' => $path,
                            'type' => 'image'
                        ]);
                    }
                }

                // Handle documents upload
                if ($request->hasFile('documents')) {
                    foreach ($request->file('documents') as $document) {
                        $path = $this->storeProposalFile($document, 'documents');
                        ProposalMedia::create([
                            'proposal_id' => $proposal->id,
                            'path' => $path,
                            'type' => 'document'
                        ]);
                    }
                }

                // Load relationships and append URLs
                $proposal->load('media');
                $this->appendMediaUrls($proposal);

                // Normalize status for frontend
                $proposal->status = $this->normalizeStatus($proposal->status);

                return response()->json([
                    'message' => 'Proposal submitted successfully',
                    'data' => $proposal
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Proposal creation failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'campaign_id' => $campaignId,
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to create proposal',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Display the specified proposal with media URLs
     */
    public function show($id)
    {
        try {
            $proposal = Proposal::with(['user:id,name', 'campaign:id,title', 'media'])
                ->whereNull('deleted_at')
                ->findOrFail($id);

            // Check if user has permission to view
            $user = Auth::user();
            if (!$user->isAdmin() && !$user->isModerator() && $user->id !== $proposal->user_id && $user->id !== $proposal->campaign->user_id) {
                return response()->json([
                    'message' => 'Unauthorized to view this proposal'
                ], 403);
            }

            // Append media URLs
            $this->appendMediaUrls($proposal);

            // Normalize status for frontend
            $proposal->status = $this->normalizeStatus($proposal->status);

            return response()->json([
                'data' => $proposal,
                'message' => 'Proposal retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Proposal not found: ' . $e->getMessage(), [
                'proposal_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Proposal not found',
                'error' => 'The requested proposal does not exist'
            ], 404);
        }
    }

    /**
     * Update the specified proposal with media handling
     */
    public function update(UpdateProposalRequest $request, $id)
    {
        try {
            return DB::transaction(function () use ($request, $id) {
                $proposal = Proposal::whereNull('deleted_at')->findOrFail($id);

                // Check if user can update this proposal
                if (Auth::id() !== $proposal->user_id && !Auth::user()->isAdmin()) {
                    return response()->json([
                        'message' => 'Unauthorized to update this proposal'
                    ], 403);
                }

                $data = $request->validated();

                // Update the proposal
                $proposal->update($data);

                // Handle new images upload
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $this->storeProposalFile($image, 'images');
                        ProposalMedia::create([
                            'proposal_id' => $proposal->id,
                            'path' => $path,
                            'type' => 'image'
                        ]);
                    }
                }

                // Handle new documents upload
                if ($request->hasFile('documents')) {
                    foreach ($request->file('documents') as $document) {
                        $path = $this->storeProposalFile($document, 'documents');
                        ProposalMedia::create([
                            'proposal_id' => $proposal->id,
                            'path' => $path,
                            'type' => 'document'
                        ]);
                    }
                }

                // Load relationships and append URLs
                $proposal->load('media');
                $this->appendMediaUrls($proposal);

                // Normalize status for frontend
                $proposal->status = $this->normalizeStatus($proposal->status);

                return response()->json([
                    'message' => 'Proposal updated successfully',
                    'data' => $proposal
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Proposal update failed: ' . $e->getMessage(), [
                'proposal_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to update proposal',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Remove the specified proposal and its media
     */
    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $proposal = Proposal::whereNull('deleted_at')->findOrFail($id);

                // Check if user can delete this proposal
                if (Auth::id() !== $proposal->user_id && !Auth::user()->isAdmin()) {
                    return response()->json([
                        'message' => 'Unauthorized to delete this proposal'
                    ], 403);
                }

                // Delete associated media
                $mediaPaths = $proposal->media->pluck('path')->toArray();
                ProposalMedia::where('proposal_id', $proposal->id)->delete();

                // Delete the proposal
                $proposal->delete();

                // Delete files from storage
                Storage::disk('public')->delete(array_filter($mediaPaths));

                return response()->json([
                    'message' => 'Proposal deleted successfully'
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Proposal deletion failed: ' . $e->getMessage(), [
                'proposal_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to delete proposal',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Update proposal status (for campaign owners/admins)
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $proposal = Proposal::whereNull('deleted_at')->findOrFail($id);
            $user = Auth::user();

            // Verify user has permission to update status
            if (!$user->isAdmin() && $user->id !== $proposal->campaign->user_id) {
                return response()->json([
                    'message' => 'Unauthorized to update proposal status'
                ], 403);
            }

            $request->validate([
                'status' => 'required|in:pending,under_review,approved,funded,rejected',
                'feedback' => 'nullable|string|max:1000'
            ]);

            $proposal->update([
                'status' => $request->status,
                'feedback' => $request->feedback
            ]);

            // Normalize status for frontend
            $proposal->status = $this->normalizeStatus($proposal->status);

            return response()->json([
                'message' => 'Proposal status updated successfully',
                'data' => $proposal
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update proposal status: ' . $e->getMessage(), [
                'proposal_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to update proposal status',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Helper method to store proposal files with consistent naming
     */
    private function storeProposalFile($file, $subdirectory)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . '.' . $extension;
        return $file->storeAs("proposals/{$subdirectory}", $filename, 'public');
    }

    /**
     * Helper method to append media URLs to proposal model
     */
    private function appendMediaUrls($proposal)
    {
        $proposal->media->each(function ($media) {
            $media->url = Storage::url($media->path);
        });

        return $proposal;
    }

    /**
     * Normalize status values for consistent frontend display
     */
    private function normalizeStatus($status)
    {
        $statusMap = [
            'pending' => 'Pending',
            'under_review' => 'Under Review',
            'approved' => 'Accepted',
            'funded' => 'Funded',
            'rejected' => 'Rejected'
        ];

        return $statusMap[strtolower($status)] ?? ucfirst($status);
    }
}