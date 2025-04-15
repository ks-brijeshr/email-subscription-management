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

    public function __construct($subjectText, $bodyText, $fromEmail)
    {
        $this->subjectText = $subjectText;
        $this->bodyText = $bodyText;

        // From email set karna yaha
        $this->from($fromEmail);
    }

    public function build()
    {
        return $this->view('emails.custom')
            ->subject($this->subjectText)
            ->with([
                'bodyText' => $this->bodyText,
            ]);
    }
}
