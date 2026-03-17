import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyOtp, registerUser, sendOtp } from '../features/auth/authSlice';

export default function OtpVerifyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, pendingEmail, pendingRegistration } = useSelector((s) => s.auth);
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const email = pendingEmail || pendingRegistration?.email;

  React.useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  function handleChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputs.current[5]?.focus();
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    const verifyResult = await dispatch(verifyOtp({ email, otp }));
    if (!verifyOtp.fulfilled.match(verifyResult)) {
      toast.error(verifyResult.payload || 'Invalid OTP. Please try again.');
      return;
    }

    const regResult = await dispatch(registerUser(pendingRegistration));
    if (registerUser.fulfilled.match(regResult)) {
      toast.success('🎉 Welcome! Your account is ready.');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(regResult.payload || 'Registration failed. Please try again.');
    }
  }

  async function handleResend() {
    if (!email) return;
    const result = await dispatch(sendOtp(email));
    if (sendOtp.fulfilled.match(result)) {
      toast.info(`New OTP sent to ${email}`);
      setDigits(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } else {
      toast.error('Could not resend OTP. Please try again.');
    }
  }

  return (
    <div className="page page--center">
      <div className="otp-card">
        <div className="otp-card__icon">📬</div>
        <h2 className="otp-card__title">Verify Your Email</h2>
        <p className="otp-card__subtitle">
          We sent a 6-digit OTP to <strong>{email}</strong>.<br />
          Check your inbox (and spam folder).
        </p>

        <form onSubmit={handleVerify}>
          <div className="otp-inputs" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                className="otp-inputs__cell"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="btn btn--primary btn--full"
            type="submit"
            disabled={loading || digits.join('').length < 6}
          >
            {loading ? 'Verifying…' : 'Verify & Complete Registration'}
          </button>
        </form>

        <button className="btn btn--ghost btn--full" onClick={handleResend} disabled={loading}>
          Resend OTP
        </button>

        <Link to="/register" className="otp-card__back">
          ← Change email
        </Link>
      </div>
    </div>
  );
}
