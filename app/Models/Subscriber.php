<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_id',
        'name',
        'email',
        'status',
        'metadata'
    ];

    public function tags()
    {
        return $this->hasMany(SubscriberTag::class, 'subscriber_id');
    }

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Relationship: Each subscriber belongs to a subscription list
     */

    public function subscriptionList()
    {
        return $this->belongsTo(SubscriptionList::class, 'list_id');
    }
}
