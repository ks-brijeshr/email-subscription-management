<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RateLimitLog extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'ip_address', 'endpoint', 'request_count', 'enforced_by'];
}
