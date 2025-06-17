<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InviteExistingUser extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $role;
    public $token;
    public $organizationName;

    public function __construct($email, $role, $token, $organizationName)
    {
        $this->email = $email;
        $this->role = $role;
        $this->token = $token;
        $this->organizationName = $organizationName;
    }

    public function build()
    {
        return $this->subject("You're invited to join {$this->organizationName}")
            ->view('emails.invite-existing')
            ->with([
                'email' => $this->email,
                'role' => $this->role,
                'organizationName' => $this->organizationName,
                'acceptUrl' => url("/invitation/accept/{$this->token}"),
            ]);
    }
}
