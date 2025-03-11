<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionList;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\SubscriptionListRequest;
use App\Mail\SubscriptionVerificationMail;

class SubscriptionListController extends Controller
{
    /**
     * Store a new subscription list with restrictions
     */
    public function store(SubscriptionListRequest $request): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        Log::info('User creating subscription list:', ['user_id' => $user->id]);

        // Only check email restrictions if an email is provided
        if ($request->has('email') && !$this->passesEmailRestrictions($request)) {
            return response()->json(['error' => 'Email restrictions failed.'], 422);
        }

        // Create subscription list
        $subscriptionList = SubscriptionList::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'allow_business_email_only' => $request->allow_business_email_only ?? true,
            'block_temporary_email' => $request->block_temporary_email ?? true,
            'require_email_verification' => $request->require_email_verification ?? true,
            'check_domain_existence' => $request->check_domain_existence ?? true,
            'verify_dns_records' => $request->verify_dns_records ?? true,
            'is_verified' => false,         // Subscription is inactive until email verification
        ]);

        // Send verification email
        $this->sendVerificationEmail($subscriptionList);

        return response()->json([
            'message' => 'Subscription list created successfully. Please verify your email.',
            'subscription_list' => $subscriptionList
        ], 201);
    }


    private function sendVerificationEmail($subscriptionList)
    {
        $token = encrypt($subscriptionList->id);

        Mail::to(Auth::user()->email)->send(new SubscriptionVerificationMail($subscriptionList, $token));
    }


    public function verify($token): JsonResponse
    {
        $subscriptionListId = decrypt($token);
        $subscriptionList = SubscriptionList::find($subscriptionListId);

        if (!$subscriptionList) {
            return response()->json(['error' => 'Invalid verification token'], 400);
        }

        // Mark as verified
        $subscriptionList->update(['is_verified' => true]);

        return response()->json(['message' => 'Subscription verified successfully.']);
    }

    /**
     * Check email restrictions before adding to the list
     */
    private function passesEmailRestrictions($request): bool
    {
        if (!isset($request->email)) {
            Log::warning("Validation Failed: No email provided in request.");
            return false;
        }

        $email = $request->email;
        $domain = $this->extractDomainFromEmail($email);

        if (!$domain) {
            Log::warning("Validation Failed: Invalid email format ($email)");
            return false;
        }

        if ($request->allow_business_email_only && $this->isPublicEmailProvider($domain)) {
            Log::warning("Validation Failed: Public email provider blocked ($domain)");
            return false;
        }

        if ($request->block_temporary_email && $this->isTemporaryEmail($domain)) {
            Log::warning("Validation Failed: Temporary email provider blocked ($domain)");
            return false;
        }

        if ($request->check_domain_existence && !$this->domainExists($domain)) {
            Log::warning("Validation Failed: Domain does not exist ($domain)");
            return false;
        }

        if ($request->verify_dns_records && !$this->checkDNSRecords($domain)) {
            Log::warning("Validation Failed: DNS records not found ($domain)");
            return false;
        }

        return true;
    }



    /**
     * Extract domain from email
     */
    private function extractDomainFromEmail($email): ?string
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return substr(strrchr($email, "@"), 1);
        }
        return null;
    }

    /**
     * Check if an email belongs to a public provider like Gmail, Yahoo
     */
    private function isPublicEmailProvider($domain): bool
    {
        $publicProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'];
        return in_array(strtolower($domain), $publicProviders);
    }

    /**
     * Block temporary email providers (burner email services)
     */
    private function isTemporaryEmail($domain): bool
    {
        $tempDomains = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com'];
        return in_array(strtolower($domain), $tempDomains);
    }

    /**
     * Check if the domain exists
     */
    private function domainExists($domain): bool
    {
        return !empty($domain) && (checkdnsrr($domain, "A") || checkdnsrr($domain, "MX"));
    }

    /**
     * Verify specific DNS records (MX, SPF, DKIM)
     */
    private function checkDNSRecords($domain): bool
    {
        return !empty($domain) &&
            checkdnsrr($domain, "MX") &&
            checkdnsrr($domain, "TXT") &&
            checkdnsrr("_dmarc." . $domain, "TXT");
    }
}
