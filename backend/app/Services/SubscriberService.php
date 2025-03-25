<?php

namespace App\Services;

use App\Models\Subscriber;
use App\Models\SubscriptionList;

class SubscriberService
{
    public function addSubscriber($list_id, $data)
    {
        // Check if subscription list exists
        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return ['error' => 'Subscription list not found.', 'status' => 404];
        }

        // Create subscriber
        $subscriber = Subscriber::create([
            'list_id' => $list_id,
            'email' => $data['email'],
            'name' => $data['name'] ?? null,
            'metadata' => isset($data['metadata']) ? json_decode($data['metadata'], true) : [],
            'status' => 'inactive',
        ]);

        return ['subscriber' => $subscriber, 'status' => 201];
    }

    public function getAllSubscribers($list_id)
    {
        $subscriptionList = SubscriptionList::find($list_id);
        if (!$subscriptionList) {
            return ['error' => 'Subscription list not found.', 'status' => 404];
        }

        $subscribers = Subscriber::where('list_id', $list_id)
            ->select('id', 'list_id', 'name', 'email', 'created_at', 'updated_at')
            ->get()
            ->map(function ($subscriber) {
                return [
                    "id" => $subscriber->id,
                    "list_id" => $subscriber->list_id,
                    "name" => $subscriber->name,
                    "email" => $subscriber->email,
                    "subscribed_at" => $subscriber->created_at->toDateTimeString(),
                    "created_at" => $subscriber->created_at->toDateTimeString(),
                    "updated_at" => $subscriber->updated_at->toDateTimeString()
                ];
            });

        return ['list_name' => $subscriptionList->name, 'subscribers' => $subscribers, 'status' => 200];
    }

    public function updateSubscriberStatus($subscriber_id, $status)
    {
        $subscriber = Subscriber::find($subscriber_id);
        if (!$subscriber) {
            return ['error' => 'Subscriber not found.', 'status' => 404];
        }

        $subscriber->update(['status' => $status]);

        return ['message' => 'Subscriber status updated successfully.', 'status' => 200];
    }

    public function getSubscriberDetails($subscriber_id)
    {
        $subscriber = Subscriber::with('tags')->find($subscriber_id);

        if (!$subscriber) {
            return ['error' => 'Subscriber not found.', 'status' => 404];
        }

        return [
            "id" => $subscriber->id,
            "list_id" => $subscriber->list_id,
            "name" => $subscriber->name,
            "email" => $subscriber->email,
            "tags" => $subscriber->tags->pluck('tag'),
            "metadata" => !empty($subscriber->metadata) ? $subscriber->metadata : (object)[],
            "status" => $subscriber->status,
            "created_at" => $subscriber->created_at->toDateTimeString(),
            "updated_at" => $subscriber->updated_at->toDateTimeString(),
            "status" => 200
        ];
    }
}
