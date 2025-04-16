<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $bodyText;
    public $unsubscribeLink;

    public function __construct($subjectText, $bodyText, $fromEmail, $unsubscribeLink)
    {
        $this->subjectText = $subjectText;
        $this->bodyText = $bodyText;
        $this->unsubscribeLink = $unsubscribeLink;
        $this->from($fromEmail);
    }

    public function build()
    {
        return $this->view('emails.custom')
            ->subject($this->subjectText)
            ->with([
                'bodyText' => $this->bodyText,
                'unsubscribeLink' => $this->unsubscribeLink
            ]);
    }
}
