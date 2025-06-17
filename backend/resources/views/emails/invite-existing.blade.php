<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>You're Invited to Join {{ $organizationName }}</title>
</head>

<body>
    <h2>Hello {{ $email }},</h2>

    <p>You have been invited to join the organization <strong>{{ $organizationName }}</strong> as a
        <strong>{{ ucfirst($role) }}</strong>.
    </p>

    <p>
        <a href="{{ $acceptUrl }}"
            style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        ">Click
            here to accept the invitation</a>
    </p>

    <p>If you didn’t expect this invitation, you can safely ignore this email.</p>

    <p>Thank you,<br>Your Team</p>
</body>

</html>
