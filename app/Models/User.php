<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;


    protected $guarded = [];
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',


    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function sendPasswordResetNotification($token)
    {
        $url = url('/password-reset?token=' . $token . '&email=' . $this->email);

        $this->notify(new ResetPasswordNotification($url));
    }

    public function apiTokens()
    {
        return $this->hasMany(ApiToken::class);
    }
}
