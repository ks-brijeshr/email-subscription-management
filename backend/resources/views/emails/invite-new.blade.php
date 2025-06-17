<h2>Hello {{ $user->name ?? 'User' }},</h2>

@if ($userAlreadyExists)
    <p>You have been added to an organization.</p>
    <p><a href="{{ $signupUrl }}">Click here to accept the invitation</a></p>
@else
    <p>You have been invited to join our organization.</p>
    <p><a href="{{ $signupUrl }}">Click here to sign up and join</a></p>
@endif
