<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe Confirmation</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
        <h2>Unsubscribe from Emails</h2>
        <p>Are you sure you want to unsubscribe from our email list?</p>
        <form action="{{ route('unsubscribe.confirm.post', ['subscriberId' => $subscriber->id, 'token' => $token]) }}"
            method="POST">
            @csrf
            <button type="submit" class="btn btn-danger">Yes, Unsubscribe Me</button>
            <a href="/" class="btn btn-secondary">No, Keep Me Subscribed</a>
        </form>


    </div>
</body>

</html>
