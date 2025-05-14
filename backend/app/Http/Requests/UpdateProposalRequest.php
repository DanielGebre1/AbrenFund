<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProposalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
         return $this->user()->can('update', $this->proposal);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
           'title' => 'sometimes|string|min:5|max:100',
            'description' => 'sometimes|string|min:20|max:2000',
            'problem_statement' => 'sometimes|string|min:20|max:1000',
            'proposed_solution' => 'sometimes|string|min:20|max:1000',
            'budget_breakdown' => 'sometimes|string|min:20|max:1000',
            'timeline' => 'sometimes|string|min:5',
            'expected_impact' => 'sometimes|string|min:20|max:1000',
            'team_info' => 'sometimes|string|min:10',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,doc,docx|max:5120',
            'status' => 'sometimes|in:pending,approved,rejected',
            'feedback' => 'nullable|string|max:1000',
        ];
    }
}
