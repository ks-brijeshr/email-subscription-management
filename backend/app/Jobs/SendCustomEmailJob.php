<?php

namespace App\Jobs;

use App\Mail\CustomEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendCustomEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $subscriberEmail;
    protected $subjectText;
    protected $bodyText;
    protected $fromEmail;
    protected $unsubscribeLink;

    public function __construct($subscriberEmail, $subjectText, $bodyText, $fromEmail, $unsubscribeLink)
    {
        $this->subscriberEmail = $subscriberEmail;
        $this->subjectText = $subjectText;
        $this->bodyText = $bodyText;
        $this->fromEmail = $fromEmail;
        $this->unsubscribeLink = $unsubscribeLink;
    }

    public function handle()
    {
        Mail::to($this->subscriberEmail)->send(new CustomEmail(
            $this->subjectText,
            $this->bodyText,
            $this->fromEmail,
            $this->unsubscribeLink
        ));
    }
}
