import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  React.useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="page page--center">
      <div className="welcome">
        <div className="welcome__logo">🚀</div>
        <h1 className="welcome__title">OnboardMe</h1>
        <p className="welcome__subtitle">
          Your personalised dashboard starts here. Register in seconds using your Gmail or email.
        </p>
        <div className="welcome__actions">
          <button className="btn btn--primary" onClick={() => navigate('/register')}>
            Get Started
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/flowchart')}>
            View Onboarding Flow
          </button>
        </div>
        <p className="welcome__hint">Already have an account? Just enter your email to log in.</p>
      </div>
    </div>
  );
}
