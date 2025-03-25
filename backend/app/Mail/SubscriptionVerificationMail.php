<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriptionList;
    public $token;
    /**
     * Create a new message instance.
     */
    public function __construct($subscriptionList, $token)
    {
        $this->subscriptionList = $subscriptionList;
        $this->token = $token;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscription Verification Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            // view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        return $this->subject('Verify Your Subscription')
            ->view('emails.verify_subscription')
            ->with([
                'subscriptionList' => $this->subscriptionList,
                'verificationLink' => url("/api/subscription-list/verify/{$this->token}"),
            ]);
    }
}
