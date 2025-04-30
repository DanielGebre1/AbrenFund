@component('mail::message')
# Reset Your Password

You recently requested to reset your password.

Click the button below to reset it:

@component('mail::button', ['url' => $url])
Reset Password
@endcomponent

This link will expire in {{ $expires }}.

If you didn’t request this password reset, please ignore this email or contact support.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
