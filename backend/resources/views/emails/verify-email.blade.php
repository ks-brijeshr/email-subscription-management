<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .container {
            background-color: #ffffff;
            border-radius: 5px;
            padding: 20px;
            max-width: 500px;
            margin: auto;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .button {
            background-color: #3490dc;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Hello {{ $user->name }},</h2>
        <p>Thank you for registering! Please click the button below to verify your email address:</p>

        <a href="{{ url('/email/verify/'.$user->id.'/'.sha1($user->email)) }}" class="button">Verify Email</a>

        <p>If you did not create an account, no further action is required.</p>

        <div class="footer">
            &copy; {{ date('Y') }} Your Website. All rights reserved.
        </div>
    </div>
</body>

</html>
