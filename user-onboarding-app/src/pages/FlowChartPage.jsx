import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FLOW_STEPS = [
  {
    id: 'start',
    type: 'terminal',
    icon: '▶',
    title: 'App Launch',
    detail: 'User opens the OnboardMe app on their device.',
    color: '#4f46e5',
  },
  {
    id: 'welcome',
    type: 'process',
    icon: '🏠',
    title: 'Welcome Screen',
    detail: 'Splash / landing screen with "Get Started" CTA and a link to view the onboarding flow.',
    color: '#6366f1',
  },
  {
    id: 'register',
    type: 'process',
    icon: '📝',
    title: 'Registration Form',
    detail:
      'User enters Full Name, Email (Gmail or personal domain — temporary/disposable emails are blocked), Password, and Confirm Password.',
    color: '#0891b2',
  },
  {
    id: 'email-validate',
    type: 'decision',
    icon: '✅',
    title: 'Email Valid?',
    detail:
      'Client-side Yup validation checks format and blocks throwaway domains. If invalid → error shown inline. If valid → proceed.',
    color: '#d97706',
    branches: [
      { label: 'No', color: '#ef4444', next: 'Show inline error → user corrects form' },
      { label: 'Yes', color: '#059669', next: 'Call POST /auth/send-otp' },
    ],
  },
  {
    id: 'send-otp',
    type: 'process',
    icon: '📧',
    title: 'Send OTP via Gmail',
    detail:
      'Server generates a cryptographically random 6-digit OTP (valid 10 min), stores it server-side, and dispatches an email using Nodemailer + Gmail OAuth2 / App Password.',
    color: '#0891b2',
  },
  {
    id: 'otp-screen',
    type: 'process',
    icon: '🔢',
    title: 'OTP Entry Screen',
    detail:
      'User enters the 6-digit code. Cells auto-advance on input; paste support; Resend OTP button with cool-down.',
    color: '#6366f1',
  },
  {
    id: 'otp-verify',
    type: 'decision',
    icon: '🔐',
    title: 'OTP Correct?',
    detail:
      'Server compares submitted OTP with stored value and checks expiry (10 min window).',
    color: '#d97706',
    branches: [
      { label: 'No / Expired', color: '#ef4444', next: 'Error toast → Resend or retry' },
      { label: 'Yes', color: '#059669', next: 'Call POST /auth/register' },
    ],
  },
  {
    id: 'create-account',
    type: 'process',
    icon: '👤',
    title: 'Create Account',
    detail:
      'Server creates the user record (password hashed with bcrypt), stores in DB, sends a welcome email notification via Gmail, and returns the new user object.',
    color: '#059669',
  },
  {
    id: 'notification',
    type: 'process',
    icon: '📬',
    title: 'Registration Notification',
    detail:
      'Gmail account dispatches a "Welcome to OnboardMe!" email confirming successful registration.',
    color: '#0891b2',
  },
  {
    id: 'dashboard',
    type: 'process',
    icon: '🏠',
    title: 'Landing Dashboard',
    detail:
      'User is redirected to the personalised dashboard showing stat cards, quick actions, and recent activity.',
    color: '#4f46e5',
  },
  {
    id: 'navigation',
    type: 'process',
    icon: '🧭',
    title: 'Menu Navigation',
    detail:
      'Bottom tab bar provides access to Home, Profile, Flow Chart, Settings, and Logout. All screens are protected routes.',
    color: '#6366f1',
  },
  {
    id: 'end',
    type: 'terminal',
    icon: '⏹',
    title: 'Session Active',
    detail: 'User remains authenticated (session stored in sessionStorage) until they log out.',
    color: '#4f46e5',
  },
];

const TYPE_SHAPES = {
  terminal: 'rounded',
  process: 'rect',
  decision: 'diamond',
};

export default function FlowChartPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="page page--flowchart">
      <header className="page__header">
        <Link to="/" className="back-btn">← Home</Link>
        <h2 className="page__title">Onboarding Flow</h2>
        <p className="page__subtitle">Tap any step for details</p>
      </header>

      <div className="flowchart">
        {FLOW_STEPS.map((step, idx) => (
          <React.Fragment key={step.id}>
            <button
              className={`fc-node fc-node--${TYPE_SHAPES[step.type]}${active === step.id ? ' fc-node--active' : ''}`}
              style={{ '--fc-color': step.color }}
              onClick={() => setActive(active === step.id ? null : step.id)}
              aria-expanded={active === step.id}
            >
              <span className="fc-node__icon">{step.icon}</span>
              <span className="fc-node__title">{step.title}</span>
              {step.type === 'decision' && <span className="fc-node__badge">Decision</span>}
            </button>

            {active === step.id && (
              <div className="fc-detail" role="region" aria-label={`Details: ${step.title}`}>
                <p className="fc-detail__text">{step.detail}</p>
                {step.branches && (
                  <div className="fc-branches">
                    {step.branches.map((b) => (
                      <div
                        key={b.label}
                        className="fc-branch"
                        style={{ '--branch-color': b.color }}
                      >
                        <span className="fc-branch__label">{b.label}</span>
                        <span className="fc-branch__arrow">→</span>
                        <span className="fc-branch__next">{b.next}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {idx < FLOW_STEPS.length - 1 && (
              <div className="fc-connector" aria-hidden="true">
                <div className="fc-connector__line" />
                <div className="fc-connector__arrow">▼</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="fc-legend">
        <h3 className="fc-legend__title">Legend</h3>
        <div className="fc-legend__items">
          <div className="fc-legend__item">
            <div className="fc-legend__shape fc-legend__shape--rounded" />
            <span>Start / End</span>
          </div>
          <div className="fc-legend__item">
            <div className="fc-legend__shape fc-legend__shape--rect" />
            <span>Process</span>
          </div>
          <div className="fc-legend__item">
            <div className="fc-legend__shape fc-legend__shape--diamond" />
            <span>Decision</span>
          </div>
        </div>
      </div>
    </div>
  );
}
