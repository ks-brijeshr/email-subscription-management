<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnsubscribeLog extends Model
{
    use HasFactory;

    protected $fillable = ['list_id', 'subscriber_id', 'unsubscribed_at', 'reason'];

    public function subscriber()
    {
        return $this->belongsTo(Subscriber::class);
    }

    public function subscriptionList()
    {
        return $this->belongsTo(SubscriptionList::class, 'list_id');
    }
}
