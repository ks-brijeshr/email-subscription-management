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

    protected $casts = [
        'metadata' => 'array',
    ];

    public function tags()
    {
        return $this->hasMany(SubscriberTag::class, 'subscriber_id');
    }

    public function subscriptionList()
    {
        return $this->belongsTo(SubscriptionList::class, 'list_id');
    }
}
