<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $baseRules = [
            'type' => 'required|in:project,challenge',
            'title' => 'required|string|min:5|max:255',
            'short_description' => 'required|string|min:10|max:255',
            'full_description' => 'required|string|min:50',
            'category' => 'required|string|max:255',
            'thumbnail_image' => 'nullable|image|max:5120', // 5MB
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
        ];

        if ($this->input('type') === 'project') {
            $projectRules = [
                'funding_goal' => 'required|numeric|min:1',
                'end_date' => 'required|date|after:today',
                'funding_type' => 'required|in:all_or_nothing,keep_what_you_raise',
            ];
            return array_merge($baseRules, $projectRules);
        }

        if ($this->input('type') === 'challenge') {
            $challengeRules = [
                'reward_amount' => 'required|numeric|min:1',
                'submission_deadline' => 'required|date|after:today',
                'expected_delivery_date' => 'required|date|after:submission_deadline',
                'eligibility_criteria' => 'required|string|min:10',
                'project_scope' => 'required|string|min:50',
                'company_name' => 'required|string|min:2|max:255',
                'company_description' => 'required|string|min:50',
                'contact_email' => 'required|email|max:255',
            ];
            return array_merge($baseRules, $challengeRules);
        }

        return $baseRules;
    }

    public function messages()
    {
        return [
            'images.*.max' => 'Each image must be less than 5MB',
            'thumbnail_image.max' => 'Thumbnail image must be less than 5MB',
            'end_date.after' => 'End date must be in the future',
            'expected_delivery_date.after' => 'Delivery date must be after submission deadline',
        ];
    }
}