<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionList;
use App\Models\Subscriber;
use Illuminate\Pagination\LengthAwarePaginator;

class SubscriberListController extends Controller
{


    public function getSubscribersByList($list_id)
    {
        $subscriptionList = SubscriptionList::find($list_id);

        if (!$subscriptionList) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription list not found.'
            ], 404);
        }

        $perPage = request()->query('perPage', 10);
        $page = request()->query('page', 1);

        // Get paginated subscribers for this list
        $query = Subscriber::with('tags')
            ->where('list_id', $list_id)
            ->orderBy('created_at', 'desc');

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $formattedSubscribers = collect($paginator->items())->map(function ($subscriber) {
            return [
                'id' => $subscriber->id,
                'list_id' => $subscriber->list_id,
                'name' => $subscriber->name,
                'email' => $subscriber->email,
                'status' => $subscriber->status,
                'subscribed_at' => optional($subscriber->created_at)->toDateTimeString(),
                'created_at' => $subscriber->created_at,
                'updated_at' => $subscriber->updated_at,
                'tags' => $subscriber->tags->pluck('tag'),
            ];
        });

        return response()->json([
            'success' => true,
            'list_name' => $subscriptionList->name,
            'subscribers' => $formattedSubscribers,
            'pagination' => [
                'total' => $paginator->total(),
                'perPage' => $paginator->perPage(),
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'nextPageUrl' => $paginator->nextPageUrl(),
                'prevPageUrl' => $paginator->previousPageUrl(),
            ]
        ]);
    }
}
