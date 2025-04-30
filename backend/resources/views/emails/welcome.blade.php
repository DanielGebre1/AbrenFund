<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to AbrenFund</title>
</head>
<body>
    <h1>Welcome to AbrenFund, {{ $user->name }}!</h1>

    <p>We're excited to have you join the AbrenFund community!</p>

    <p>Please click the button below to verify your email address and complete your registration:</p>

    <p>
        <a href="{{ $verificationUrl }}" style="display:inline-block; padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
            Verify Email
        </a>
    </p>

    <p>This link will expire in 60 minutes.</p>

    <p><strong>For your security, please do not share this link with anyone.</strong></p>

    <p>Thanks,<br>The AbrenFund Team</p>
</body>
</html>
