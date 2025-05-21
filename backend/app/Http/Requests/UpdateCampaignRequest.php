<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $baseRules = [
            'title' => 'sometimes|string|min:5|max:255',
            'short_description' => 'sometimes|string|min:10|max:255',
            'full_description' => 'sometimes|string|min:50',
            'category' => 'sometimes|string|max:255',
            'status' => 'required|in:active,completed,suspended',
            'thumbnail_image' => 'sometimes|image|max:5120',
            'images' => 'sometimes|array',
            'images.*' => 'image|max:5120',
        ];

        if ($this->input('type') === 'project') {
            $projectRules = [
                'funding_goal' => 'sometimes|numeric|min:1',
                'end_date' => 'sometimes|date|after:today',
                'funding_type' => 'sometimes|in:all_or_nothing,keep_what_you_raise',
            ];
            return array_merge($baseRules, $projectRules);
        }

        if ($this->input('type') === 'challenge') {
            $challengeRules = [
                'reward_amount' => 'sometimes|numeric|min:1',
                'submission_deadline' => 'sometimes|date|after:today',
                'expected_delivery_date' => 'sometimes|date|after:submission_deadline',
                'eligibility_criteria' => 'sometimes|string|min:10',
                'project_scope' => 'sometimes|string|min:50',
                'company_name' => 'sometimes|string|min:2|max:255',
                'company_description' => 'sometimes|string|min:50',
                'contact_email' => 'sometimes|email|max:255',
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
        ];
    }
}
