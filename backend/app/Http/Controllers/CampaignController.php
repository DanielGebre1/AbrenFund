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
use Illuminate\Validation\ValidationException;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Campaign::with(['user:id,name', 'images:id,campaign_id,path'])
                ->withCount('images')
                ->latest();

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('user_id')) {
                if ($request->user_id === 'current') {
                    $query->where('user_id', Auth::id());
                } else {
                    $query->where('user_id', $request->user_id);
                }
            }

            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                      ->orWhere('short_description', 'like', '%'.$request->search.'%');
                });
            }

            $campaigns = $query->paginate($request->input('per_page', 10));

            $campaigns->getCollection()->transform(function ($campaign) {
                if ($campaign->thumbnail_path) {
                    $campaign->thumbnail_url = Storage::url($campaign->thumbnail_path);
                }
                $campaign->images->each(function ($image) {
                    $image->url = Storage::url($image->path);
                });

                if ($campaign->isChallenge()) {
                    $campaign->submissions_count = $campaign->proposals()->count();
                }
                
                // Decode content_checks if it exists
                if ($campaign->content_checks) {
                    $campaign->content_checks = json_decode($campaign->content_checks, true);
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

    public function store(StoreCampaignRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $user = Auth::user();
                $data = $request->validated();
                $data['user_id'] = $user->id;
                $data['status'] = 'pending';

                if ($request->hasFile('thumbnail_image')) {
                    $path = $this->storeCampaignFile($request->file('thumbnail_image'), 'thumbnails');
                    $data['thumbnail_path'] = $path;
                }

                $campaign = Campaign::create($data);

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $this->storeCampaignFile($image, 'images');
                        CampaignImage::create([
                            'campaign_id' => $campaign->id,
                            'path' => $path
                        ]);
                    }
                }

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

    public function show($id)
    {
        try {
            $campaign = Campaign::with(['user:id,name', 'images:id,campaign_id,path'])
                ->findOrFail($id);

            $this->appendMediaUrls($campaign);

            if ($campaign->isChallenge()) {
                $campaign->loadCount('proposals');
                $campaign->submissions_count = $campaign->proposals_count;
            }

            // Decode content_checks if it exists
            if ($campaign->content_checks) {
                $campaign->content_checks = json_decode($campaign->content_checks, true);
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

    public function update(UpdateCampaignRequest $request, $id)
    {
        try {
            return DB::transaction(function () use ($request, $id) {
                $campaign = Auth::user()->isAdmin()
                    ? Campaign::find($id)
                    : Campaign::where('user_id', Auth::id())->find($id);

                if (!$campaign) {
                    return response()->json(['message' => 'Campaign not found'], 404);
                }

                $data = $request->validated();

                if ($request->hasFile('thumbnail_image')) {
                    if ($campaign->thumbnail_path) {
                        Storage::disk('public')->delete($campaign->thumbnail_path);
                    }
                    $path = $this->storeCampaignFile($request->file('thumbnail_image'), 'thumbnails');
                    $data['thumbnail_path'] = $path;
                }

                $campaign->update($data);

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $this->storeCampaignFile($image, 'images');
                        CampaignImage::create([
                            'campaign_id' => $campaign->id,
                            'path' => $path
                        ]);
                    }
                }

                $campaign->load('images');
                $this->appendMediaUrls($campaign);

                return response()->json([
                    'message' => 'Campaign updated successfully',
                    'data' => $campaign
                ]);
            });
        } catch (ValidationException $e) {
            Log::error('Campaign update validation failed: ' . $e->getMessage(), [
                'campaign_id' => $id,
                'user_id' => Auth::id(),
                'errors' => $e->errors()
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
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

    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $campaign = Auth::user()->isAdmin()
                    ? Campaign::find($id)
                    : Campaign::where('user_id', Auth::id())->find($id);

                if (!$campaign) {
                    return response()->json(['message' => 'Campaign not found'], 404);
                }

                $imagePaths = $campaign->images->pluck('path')->toArray();
                CampaignImage::where('campaign_id', $campaign->id)->delete();
                
                $thumbnailPath = $campaign->thumbnail_path;
                
                $campaign->delete();

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

    public function getChallengeProposals($id)
    {
        try {
            $campaign = Campaign::findOrFail($id);
            
            if (Auth::id() !== $campaign->user_id && !Auth::user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized to view these proposals'
                ], 403);
            }

            $proposals = Proposal::with(['user:id,name', 'media'])
                ->where('campaign_id', $id)
                ->latest()
                ->get();

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

    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:active,completed,suspended'
            ]);

            $campaign = Campaign::findOrFail($id);

            if (!Auth::user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized to update campaign status'
                ], 403);
            }

            $campaign->update(['status' => $request->status]);

            return response()->json([
                'message' => 'Campaign status updated successfully',
                'data' => $campaign
            ]);
        } catch (\Exception $e) {
            Log::error('Campaign status update failed: ' . $e->getMessage(), [
                'campaign_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e
            ]);
            return response()->json([
                'message' => 'Failed to update campaign status',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    public function checkVerification()
    {
        try {
            $user = Auth::user();
            return response()->json([
                'is_verified' => $user->is_verified,
                'message' => $user->is_verified ? 'User is verified' : 'User is not verified'
            ]);
        } catch (\Exception $e) {
            Log::error('Verification check failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to check verification status',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    public function getModeratorCampaigns(Request $request)
    {
        try {
            if (!Auth::user()->isModerator() && !Auth::user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized to view campaigns for review'
                ], 403);
            }

            $query = Campaign::with(['user:id,name', 'images:id,campaign_id,path'])
                ->latest();

            if ($request->has('type')) {
                $query->where('type', $request->type);
                Log::info('Filtering campaigns by type:', ['type' => $request->type]);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%'.$request->search.'%')
                      ->orWhere('short_description', 'like', '%'.$request->search.'%');
                });
            }

            $campaigns = $query->paginate($request->input('per_page', 10));

            $campaigns->getCollection()->transform(function ($campaign) {
                if ($campaign->thumbnail_path) {
                    $campaign->thumbnail_url = Storage::url($campaign->thumbnail_path);
                }
                $campaign->images->each(function ($image) {
                    $image->url = Storage::url($image->path);
                });
                if ($campaign->isChallenge()) {
                    $campaign->submissions_count = $campaign->proposals()->count();
                } else {
                    $campaign->submissions_count = 0;
                }
                // Decode content_checks if it exists
                if ($campaign->content_checks) {
                    $campaign->content_checks = json_decode($campaign->content_checks, true);
                }
                // Ensure challenge-specific fields are present
                if ($campaign->isChallenge()) {
                    $campaign->budget = $campaign->reward_amount;
                }
                return $campaign;
            });

            Log::info('Fetched campaigns for moderator:', [
                'count' => $campaigns->count(),
                'type' => $request->type ?? 'all',
                'campaign_types' => $campaigns->pluck('type')->unique()->toArray()
            ]);

            return response()->json([
                'data' => $campaigns,
                'message' => 'Campaigns retrieved successfully for review'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve campaigns for review: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve campaigns for review',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    public function getModeratorCampaignDetails($id)
    {
        try {
            if (!Auth::user()->isModerator() && !Auth::user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized to view campaign details'
                ], 403);
            }

            $campaign = Campaign::with(['user:id,name,email', 'images:id,campaign_id,path'])
                ->findOrFail($id);

            $this->appendMediaUrls($campaign);
            // Decode content_checks if it exists
            if ($campaign->content_checks) {
                $campaign->content_checks = json_decode($campaign->content_checks, true);
            }
            // Ensure challenge-specific fields
            if ($campaign->isChallenge()) {
                $campaign->submissions_count = $campaign->proposals()->count();
                $campaign->budget = $campaign->reward_amount;
            }

            return response()->json([
                'data' => $campaign,
                'message' => 'Campaign details retrieved successfully'
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

    public function reviewCampaign(Request $request, $id)
    {
        try {
            $request->validate([
                'decision' => 'required|in:approved,rejected,changes',
                'feedback' => 'required_if:decision,rejected,changes|string|nullable|max:1000',
                'content_notes' => 'nullable|string|max:2000',
                'content_checks' => 'nullable|array',
                'content_checks.description' => 'boolean',
                'content_checks.appropriate' => 'boolean',
                'content_checks.goals' => 'boolean',
                'content_checks.budget' => 'boolean',
                'content_checks.timeline' => 'boolean|nullable',
                'content_checks.scope' => 'boolean|nullable'
            ]);

            if (!Auth::user()->isModerator() && !Auth::user()->isAdmin()) {
                return response()->json([
                    'message' => 'Unauthorized to review campaigns'
                ], 403);
            }

            $campaign = Campaign::findOrFail($id);

            $data = [
                'status' => $request->decision,
                'feedback' => $request->feedback,
                'content_notes' => $request->content_notes,
                'content_checks' => $request->content_checks ? json_encode($request->content_checks) : null
            ];

            Log::info('Review data to be saved:', $data);

            $campaign->update($data);

            // Decode content_checks for response
            $campaign->content_checks = $request->content_checks ? $request->content_checks : null;

            return response()->json([
                'message' => 'Campaign review submitted successfully',
                'data' => $this->appendMediaUrls($campaign)
            ]);
        } catch (ValidationException $e) {
            Log::error('Campaign review validation failed: ' . $e->getMessage(), [
                'campaign_id' => $id,
                'user_id' => Auth::id(),
                'errors' => $e->errors()
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Campaign review failed: ' . $e->getMessage(), [
                'campaign_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e
            ]);
            return response()->json([
                'message' => 'Failed to submit campaign review',
                'error' => 'Server error occurred'
            ], 500);
        }
    }

    public function reviewChallenge(Request $request, $id)
    {
        return $this->reviewCampaign($request, $id);
    }

    private function storeCampaignFile($file, $subdirectory)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . '.' . $extension;
        return $file->storeAs("campaigns/{$subdirectory}", $filename, 'public');
    }

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

    public function adminDashboard()
    {
        try {
            $stats = [
                'total_campaigns' => Campaign::count(),
                'active_campaigns' => Campaign::where('status', 'active')->count(),
                'completed_campaigns' => Campaign::where('status', 'completed')->count(),
                'pending_campaigns' => Campaign::where('status', 'pending')->count(),
                'suspended_campaigns' => Campaign::where('status', 'suspended')->count(),
            ];

            return response()->json([
                'data' => $stats,
                'message' => 'Dashboard statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve dashboard stats: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve dashboard statistics',
                'error' => 'Server error occurred'
            ], 500);
        }
    }
}