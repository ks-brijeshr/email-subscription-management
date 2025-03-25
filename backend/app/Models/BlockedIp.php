<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedIp extends Model
{
    use HasFactory;

    protected $table = 'ip_monitoring_and_blocking';

    protected $fillable = [
        'ip_address',
        'reason',
        'blocked_at',
        'blocked_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }
}
