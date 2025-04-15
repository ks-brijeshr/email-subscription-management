<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'is_verified'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // app/Models/SubscriptionList.php

    public function subscribers()
    {
        return $this->hasMany(\App\Models\Subscriber::class, 'list_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
