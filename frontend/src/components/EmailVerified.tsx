import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate redirection after a delay (3 seconds).
    setTimeout(() => {
      navigate('/login'); // Redirect to login page after 3 seconds
    }, 3000);
  }, [navigate]);

  return (
    <div className="verification-container">
      <h2>Your email has been successfully verified!</h2>
      <p>You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default EmailVerified;
