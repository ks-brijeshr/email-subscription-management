<?php

namespace App\Services;

use App\Models\Subscriber;
use App\Models\SubscriptionList;
use Illuminate\Support\Facades\Log;

class NewsletterService
{
    public function subscribe(string $name, string $email)
    {
        // fetch Lists
        $newsLetter = SubscriptionList::where('name', 'News letter')->first();
        $welcomeMail = SubscriptionList::where('name', 'Welcome mail')->first();

        if (!$newsLetter || !$welcomeMail) {
            return ['error' => 'Subscription lists not found.', 'status' => 404];
        }

        // Check for Existing Subscriber
        $subscriberExistsInNewsLetter = Subscriber::where('email', $email)
            ->where('list_id', $newsLetter->id)
            ->exists();
        $subscriberExistsInWelcomeMail = Subscriber::where('email', $email)
            ->where('list_id', $welcomeMail->id)
            ->exists();

        if ($subscriberExistsInNewsLetter && $subscriberExistsInWelcomeMail) {
            return ['error' => 'You are already subscribed to these lists.', 'status' => 409];
        }

        if (!$subscriberExistsInNewsLetter) {
            Subscriber::create([
                'list_id' => $newsLetter->id,
                'name' => $name,
                'email' => $email,
                'status' => 'active'
            ]);
        }

        if (!$subscriberExistsInWelcomeMail) {
            Subscriber::create([
                'list_id' => $welcomeMail->id,
                'name' => $name,
                'email' => $email,
                'status' => 'active'
            ]);
        }

        return [
            'success' => true,
            'message' => 'Subscription successful.',
            'subscriber' => [
                'name' => $name,
                'email' => $email,
                'status' => 'active',
                'lists' => [$newsLetter->name, $welcomeMail->name]
            ]
        ];
    }

    public function isBusinessEmail(string $email): bool
    {
        $personalDomains = [
            'gmail.com',
            'yahoo.com',
            'outlook.com',
            'hotmail.com',
            'aol.com',
            'icloud.com',
            'protonmail.com',
            'live.com'
        ];

        $domain = substr(strrchr($email, "@"), 1);
        return !in_array($domain, $personalDomains);
    }

    public function isTemporaryEmail(string $email): bool
    {
        $tempDomains = [
            'tempmail.com',
            'mailinator.com',
            'guerrillamail.com',
            '10minutemail.com',
            'temp-mail.org',
            'throwawaymail.com'
        ];

        $domain = substr(strrchr($email, "@"), 1);
        return in_array($domain, $tempDomains);
    }
}
