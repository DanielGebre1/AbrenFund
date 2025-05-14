<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProposalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
                    'title' => 'required|string|min:5|max:100',
            'description' => 'required|string|min:20|max:2000',
            'problem_statement' => 'required|string|min:20|max:1000',
            'proposed_solution' => 'required|string|min:20|max:1000',
            'budget_breakdown' => 'required|string|min:20|max:1000',
            'timeline' => 'required|string|min:5',
            'expected_impact' => 'required|string|min:20|max:1000',
            'team_info' => 'required|string|min:10',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,doc,docx|max:5120',
        ];
    }
}
