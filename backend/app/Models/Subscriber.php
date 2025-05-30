<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscriber extends Model
{
    use HasFactory;

    protected $table = 'subscribers';

    protected $fillable = [
        'list_id',
        'name',
        'email',
        'status',
        'metadata',
        'unsubscribe_token',
        'verification_token'
    ];

    public function tags()
    {
        return $this->hasMany(SubscriberTag::class);
    }




    protected $casts = [
        'metadata' => 'array',
    ];


    public function subscriptionLists()
    {
        return $this->belongsToMany(SubscriptionList::class, 'subscribers', 'email', 'list_id', 'email', 'id');
    }

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
