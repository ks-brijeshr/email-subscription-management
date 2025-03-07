<!DOCTYPE html>
<html>

<head>
    <title>Verify Your Email</title>
</head>

<body>
    <h1>Hello, {{ $user->name }}</h1>
    <p>Click the link below to verify your email:</p>
    <a href="{{ URL::signedRoute('verification.verify', ['token' => $user->email_verification_token]) }}">
        Verify Email
    </a>

</body>

</html>
