<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CustomEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectLine;
    public $bodyContent;

    public function __construct($subjectLine, $bodyContent)
    {
        $this->subjectLine = $subjectLine;
        $this->bodyContent = $bodyContent;
    }

    public function build()
    {
        return $this->subject($this->subjectLine)
                    ->view('emails.custom')
                    ->with([
                        'bodyContent' => $this->bodyContent,
                    ]);
    }
}



