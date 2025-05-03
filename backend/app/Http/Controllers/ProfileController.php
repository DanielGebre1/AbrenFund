<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Update user profile information
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,'.$request->user()->id,
                'bio' => 'nullable|string|max:500',
                'phone' => 'nullable|string|max:20',
                'social' => 'nullable|array',
                'social.twitter' => 'nullable|url|max:255',
                'social.facebook' => 'nullable|url|max:255',
                'social.instagram' => 'nullable|url|max:255',
                'social.linkedin' => 'nullable|url|max:255',
            ]);

            DB::beginTransaction();

            // Update user
            $request->user()->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'bio' => $validated['bio'] ?? null,
                'phone' => $validated['phone'] ?? null,
            ]);

            // Update or create social profile
            if (isset($validated['social'])) {
                $request->user()->socialProfile()->updateOrCreate(
                    ['user_id' => $request->user()->id],
                    $validated['social']
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'user' => $request->user()->fresh()->load('socialProfile')
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Profile update failed: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Upload and update user avatar
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|max:2048|mimes:jpg,jpeg,png,gif,webp'
            ]);

            // Delete old avatar if exists
            if ($request->user()->avatar) {
                Storage::disk('public')->delete($request->user()->avatar);
            }

            // Store new avatar
            $file = $request->file('avatar');
            $fileName = Str::uuid().'.'.$file->extension();
            $path = $file->storeAs('avatars', $fileName, 'public');
            $url = Storage::disk('public')->url($path);

            // Update user record
            $request->user()->update(['avatar' => $path]);

            return response()->json([
                'success' => true,
                'url' => $url,
                'user' => $request->user()->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Avatar upload failed: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}