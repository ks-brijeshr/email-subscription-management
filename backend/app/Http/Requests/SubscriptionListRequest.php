<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionListRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'allow_business_email_only' => 'boolean',
            'block_temporary_email' => 'boolean',
            'require_email_verification' => 'boolean',
            'check_domain_existence' => 'boolean',
            'verify_dns_records' => 'boolean',
        ];
    }
}
