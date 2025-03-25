<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionAnalytics extends Model
{
    use HasFactory;

    protected $fillable = ['list_id', 'recorded_date', 'new_subscribers'];

    public $timestamps = true;
}
