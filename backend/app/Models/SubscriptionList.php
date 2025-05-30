<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionList extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'allow_business_email_only',
        'block_temporary_email',
        'require_email_verification',
        'check_domain_existence',
        'verify_dns_records',
        // 'is_verified'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscribers()
    {
        return $this->hasMany(\App\Models\Subscriber::class, 'list_id');
    }

    public function allSubscribers()
    {
        return $this->belongsToMany(\App\Models\Subscriber::class, 'subscribers', 'id', 'list_id', 'id', 'email');
    }


    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship with EmailBlacklist
    public function blacklistedEmails(): HasMany
    {
        return $this->hasMany(\App\Models\EmailBlacklist::class, 'subscription_list_id');
    }
}
