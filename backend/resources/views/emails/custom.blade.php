<!DOCTYPE html>
<html>
<head>
    <title>{{ $subjectText }}</title>
</head>
<body>
    <p>{!! nl2br(e($bodyText)) !!}</p>

    <p>
        If you wish to unsubscribe, click the link below:<br>
        <a href="{{ $unsubscribeLink }}">Unsubscribe</a>
    </p>
</body>
</html>
