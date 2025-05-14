<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Models\Campaign;
use App\Models\CampaignImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CampaignController extends Controller
{
    /**
     * Get paginated list of campaigns with filters
     */
    public function index(Request $request)
    {
        try {
            $query = Campaign::with(['user:id,name', 'images:id,campaign_id,path'])
                ->withCount('images')
                ->latest();

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                      ->orWhere('short_description', 'like', '%'.$request->search.'%');
                });
            }

            $campaigns = $query->paginate($request->input('per_page', 10));

            // Append full image URLs
            $campaigns->getCollection()->transform(function ($campaign) {
                if ($campaign->thumbnail_path) {
                    $campaign->thumbnail_url = Storage::url($campaign->thumbnail_path);
                }
                $campaign->images->each(function ($image) {
                    $image->url = Storage::url($image->path);
                });

                 // Add type-specific fields
                if ($campaign->isChallenge()) {
                    $campaign->submissions_count = $campaign->proposals()->count();
                }
                
                return $campaign;
            });

            return response()->json([
                'data' => $campaigns,
                'message' => 'Campaigns retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve campaigns: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve campaigns',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Store a newly created campaign with media handling
     */
    public function store(StoreCampaignRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $user = Auth::user();
                $data = $request->validated();
                $data['user_id'] = $user->id;
                $data['status'] = 'pending';

                // Handle thumbnail image with unique filename
                if ($request->hasFile('thumbnail_image')) {
                    $path = $this->storeCampaignFile($request->file('thumbnail_image'), 'thumbnails');
                    $data['thumbnail_path'] = $path;
                }

                // Create the campaign
                $campaign = Campaign::create($data);

                // Handle additional images
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $this->storeCampaignFile($image, 'images');
                        CampaignImage::create([
                            'campaign_id' => $campaign->id,
                            'path' => $path
                        ]);
                    }
                }

                // Load relationships and append URLs
                $campaign->load('images');
                $this->appendMediaUrls($campaign);

                return response()->json([
                    'message' => 'Campaign submitted for review',
                    'data' => $campaign
                ], 201);
            });

        } catch (\Exception $e) {
            Log::error('Campaign creation failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'error' => $e
            ]);
            return response()->json([
                'message' => 'Failed to create campaign',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Display the specified campaign with media URLs
     */
    public function show($id)
    {
        try {
            $campaign = Campaign::with(['user:id,name', 'images:id,campaign_id,path'])
                ->findOrFail($id);

            // Append media URLs
            $this->appendMediaUrls($campaign);

            // Load proposals if it's a challenge
            if ($campaign->isChallenge()) {
                $campaign->loadCount('proposals');
                $campaign->submissions_count = $campaign->proposals_count;
            }

            return response()->json([
                'data' => $campaign,
                'message' => 'Campaign retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Campaign not found: ' . $e->getMessage(), [
                'campaign_id' => $id
            ]);
            return response()->json([
                'message' => 'Campaign not found',
                'error' => 'The requested campaign does not exist'
            ], 404);
        }
    }

    /**
     * Update the specified campaign with media handling
     */
    public function update(UpdateCampaignRequest $request, $id)
    {
        try {
            return DB::transaction(function () use ($request, $id) {
                $campaign = Campaign::where('user_id', Auth::id())
                    ->findOrFail($id);

                $data = $request->validated();

                // Handle thumbnail image update
                if ($request->hasFile('thumbnail_image')) {
                    // Delete old thumbnail if exists
                    if ($campaign->thumbnail_path) {
                        Storage::disk('public')->delete($campaign->thumbnail_path);
                    }
                    
                    $path = $this->storeCampaignFile($request->file('thumbnail_image'), 'thumbnails');
                    $data['thumbnail_path'] = $path;
                }

                // Update the campaign
                $campaign->update($data);

                // Handle additional images
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $this->storeCampaignFile($image, 'images');
                        CampaignImage::create([
                            'campaign_id' => $campaign->id,
                            'path' => $path
                        ]);
                    }
                }

                // Load relationships and append URLs
                $campaign->load('images');
                $this->appendMediaUrls($campaign);

                return response()->json([
                    'message' => 'Campaign updated successfully',
                    'data' => $campaign
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Campaign update failed: ' . $e->getMessage(), [
                'campaign_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e
            ]);
            return response()->json([
                'message' => 'Failed to update campaign',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Remove the specified campaign and its media
     */
    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $campaign = Campaign::where('user_id', Auth::id())
                    ->findOrFail($id);

                // Delete associated images
                $imagePaths = $campaign->images->pluck('path')->toArray();
                CampaignImage::where('campaign_id', $campaign->id)->delete();
                
                // Delete thumbnail if exists
                $thumbnailPath = $campaign->thumbnail_path;
                
                // Delete the campaign
                $campaign->delete();

                // Delete files from storage
                $pathsToDelete = array_merge($imagePaths, [$thumbnailPath]);
                Storage::disk('public')->delete(array_filter($pathsToDelete));

                return response()->json([
                    'message' => 'Campaign deleted successfully'
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Campaign deletion failed: ' . $e->getMessage(), [
                'campaign_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e
            ]);
            return response()->json([
                'message' => 'Failed to delete campaign',
                'error' => 'Server error occurred'
            ], 500);
        }
    }


     /**
     * Get proposals for a specific challenge
     */
    public function getChallengeProposals($id)
    {
        try {
            $proposals = Proposal::with(['user:id,name', 'media'])
                ->where('challenge_id', $id)
                ->latest()
                ->get();

            // Append media URLs
            $proposals->each(function ($proposal) {
                $proposal->media->each(function ($media) {
                    $media->url = Storage::url($media->path);
                });
            });

            return response()->json([
                'data' => $proposals,
                'message' => 'Proposals retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve proposals: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve proposals',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Update proposal status (for challenge owners/admins)
     */
    public function updateProposalStatus(Request $request, $id)
    {
        try {
            $proposal = Proposal::findOrFail($id);
            $user = Auth::user();

            // Verify user has permission to update status
            if (!$user->isAdmin() && $user->id !== $proposal->challenge->user_id) {
                return response()->json([
                    'message' => 'Unauthorized to update proposal status'
                ], 403);
            }

            $request->validate([
                'status' => 'required|in:approved,rejected,pending',
                'feedback' => 'nullable|string|max:1000'
            ]);

            $proposal->update([
                'status' => $request->status,
                'feedback' => $request->feedback
            ]);

            return response()->json([
                'message' => 'Proposal status updated successfully',
                'data' => $proposal
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update proposal status: ' . $e->getMessage(), [
                'proposal_id' => $id,
                'error' => $e
            ]);
            return response()->json([
                'message' => 'Failed to update proposal status',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    /**
     * Helper method to store campaign files with consistent naming
     */
    private function storeCampaignFile($file, $subdirectory)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . '.' . $extension;
        return $file->storeAs("campaigns/{$subdirectory}", $filename, 'public');
    }

    /**
     * Helper method to append media URLs to campaign model
     */
    private function appendMediaUrls($campaign)
    {
        if ($campaign->thumbnail_path) {
            $campaign->thumbnail_url = Storage::url($campaign->thumbnail_path);
        }
        
        $campaign->images->each(function ($image) {
            $image->url = Storage::url($image->path);
        });

        return $campaign;
    }
}