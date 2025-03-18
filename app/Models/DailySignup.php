<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailySignup extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'count'];

    public $timestamps = true;
}
