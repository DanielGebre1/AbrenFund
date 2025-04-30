<?php


// app/Mail/PasswordResetMail.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $resetUrl)
    {
    }

    public function build()
    {
        return $this->subject('Password Reset Request')
            ->markdown('emails.password-reset', [
                'url' => $this->resetUrl,
                'expires' => now()->addHour()->diffForHumans(),
            ]);
    }
}

// app/Mail/PasswordChangedNotification.php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordChangedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function build()
    {
        return $this->subject('Your Password Has Been Changed')
            ->markdown('emails.password-changed');
    }
}