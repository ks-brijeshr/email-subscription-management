<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InviteNewUser extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $organizationId;
    public $role;
    public $token;

    public function __construct($email, $organizationId, $role, $token)
    {
        $this->email = $email;
        $this->organizationId = $organizationId;
        $this->role = $role;
        $this->token = $token;
    }

    public function build()
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        $signupUrl = $frontendUrl . '/signup?' . http_build_query([
            'email' => $this->email,
            'org'   => $this->organizationId,
            'role'  => $this->role,
            'token' => $this->token,
        ]);

        return $this->subject('You are invited to join an organization')
            ->view('emails.invite-new')
            ->with([
                'signupUrl' => $signupUrl,
                'userAlreadyExists' => false,
            ]);
    }
}
