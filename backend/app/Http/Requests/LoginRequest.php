<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8',
        ];
    }
    public function messages()
    {
        return [
            'email.required' => 'The email field is required.',
            'email.email' => 'Enter a valid email address.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters long.'
        ];
    }
}
