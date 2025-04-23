<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailBlacklist extends Model
{
    use HasFactory;

    protected $fillable = ['email', 'reason', 'blacklisted_by'];


    public function blacklistedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'blacklisted_by');
    }

}
