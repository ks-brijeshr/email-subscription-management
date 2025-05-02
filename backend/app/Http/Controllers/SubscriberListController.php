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
        $email = request()->query('email');
        $tag = request()->query('tag');
        $status = request()->query('status');

        // Base query
        $query = Subscriber::with('tags')->where('list_id', $list_id);

        // Filters
        if (!empty($email)) {
            $query->where('email', 'LIKE', '%' . $email . '%');
        }

        if (!empty($status) && in_array($status, ['active', 'inactive'])) {
            $query->where('status', $status);
        }

        if (!empty($tag)) {
            $tagsArray = explode(' ', $tag);
            $query->whereHas('tags', function ($q) use ($tagsArray) {
                foreach ($tagsArray as $keyword) {
                    $q->where('tag', 'LIKE', '%' . $keyword . '%');
                }
            });
        }

        // Stats before pagination
        $totalCount = $query->count();
        $activeCount = (clone $query)->where('status', 'active')->count();
        $inactiveCount = (clone $query)->where('status', 'inactive')->count();

        // Paginate filtered results
        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

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
            ],
            'stats' => [
                'total' => $totalCount,
                'active' => $activeCount,
                'inactive' => $inactiveCount
            ]
        ]);
    }
}
