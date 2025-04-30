<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Carbon;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
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

    /**
     * Relationship with password reset tokens
     */
    public function passwordResetTokens()
    {
        return $this->hasMany(PasswordResetToken::class);
    }

    /**
     * Create a new password reset token for the user
     */
    public function createPasswordResetToken(): string
    {
        // Delete any existing tokens
        $this->passwordResetTokens()->delete();

        // Create new token
        $token = bin2hex(random_bytes(32));
        $expiresAt = Carbon::now()->addHours(1);

        $this->passwordResetTokens()->create([
            'token' => hash('sha256', $token),
            'expires_at' => $expiresAt,
        ]);

        return $token;
    }

    /**
     * Find a valid password reset token
     */
    public function findValidPasswordResetToken(string $token): ?PasswordResetToken
    {
        return $this->passwordResetTokens()
            ->where('token', hash('sha256', $token))
            ->where('expires_at', '>', Carbon::now())
            ->first();
    }

    /**
     * Delete all password reset tokens for the user
     */
    public function deletePasswordResetTokens(): void
    {
        $this->passwordResetTokens()->delete();
    }

    /**
     * Send the password reset notification.
     *
     * @param string $token
     * @param string|null $url
     * @return void
     */
    public function sendPasswordResetNotification($token, $url = null)
    {
        if (!$url) {
            $url = config('app.frontend_url') . '/reset-password?' . http_build_query([
                'token' => $token,
                'email' => $this->email
            ]);
        }

        // Send the custom notification with the reset password URL
        $this->notify(new ResetPasswordNotification($url));
    }
}
