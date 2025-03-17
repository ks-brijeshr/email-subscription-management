<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_id',
        'name',
        'email',
        'status',
        'metadata',
        'unsubscribe_token'
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

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($subscriber) {
            $subscriber->unsubscribe_token = Str::random(32); //Generate random token
        });
    }

    public function unsubscribeLogs()
    {
        return $this->hasMany(UnsubscribeLog::class);
    }
}
