<?php

namespace App\Services;

use App\Models\User;
use App\Models\SubscriptionList;
use App\Models\EmailVerificationLog;

class EmailVerificationService
{
    public function logVerificationResult($userId = null, $subscriptionListId = null, $email = null, $status)
    {
        $user = User::find($userId);
        $subscriptionList = SubscriptionList::find($subscriptionListId);

        EmailVerificationLog::create([
            'user_id' => $userId,
            'subscription_list_id' => $subscriptionListId,
            'email' => optional($user)->email,
            'status' => $status,
        ]);
    }



    public function getVerificationStatistics()
    {
        return [
            'total_verified' => EmailVerificationLog::where('status', 'passed')->count(),
            'total_failed' => EmailVerificationLog::where('status', 'failed')->count(),
        ];
    }
}
