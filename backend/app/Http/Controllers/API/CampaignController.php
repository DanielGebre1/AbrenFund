<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'goal_amount' => 'required|numeric|min:1',
        'end_date' => 'required|date|after:today',
        'images' => 'nullable|array',
        'images.*' => 'base64image', // You'll need a custom validation rule or handle it manually
    ]);

    $campaign = Campaign::create([
        'user_id' => auth()->id(),
        'title' => $validated['title'],
        'description' => $validated['description'],
        'goal_amount' => $validated['goal_amount'],
        'end_date' => $validated['end_date'],
    ]);

    if (!empty($validated['images'])) {
        foreach ($validated['images'] as $imgData) {
            $filename = uniqid() . '.png';
            $path = "campaigns/{$filename}";
            Storage::disk('public')->put($path, base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imgData)));
            $campaign->images()->create(['image_path' => $path]);
        }
    }

    return response()->json(['message' => 'Campaign created successfully'], 201);
}

}
