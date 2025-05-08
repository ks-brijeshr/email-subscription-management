<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubscriberVerificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $subscriber;

    public function __construct($subscriber)
    {
        $this->subscriber = $subscriber;
    }

    public function build()
    {
        return $this->subject('Verify Your Subscription')
            ->view('emails.verify')
            ->with([
                'verificationUrl' => url("/api/subscribers/verify/{$this->subscriber->verification_token}"),
            ]);
    }
}
