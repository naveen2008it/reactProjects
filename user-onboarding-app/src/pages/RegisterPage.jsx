import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema } from '../utils/validators';
import { sendOtp, setPendingEmail, setPendingRegistration } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  async function onSubmit(data) {
    const result = await dispatch(sendOtp(data.email));
    if (sendOtp.fulfilled.match(result)) {
      dispatch(setPendingEmail(data.email));
      dispatch(setPendingRegistration({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }));
      toast.success(`OTP sent to ${data.email}`);
      navigate('/verify-otp');
    } else {
      toast.error(result.payload || 'Failed to send OTP. Please try again.');
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <Link to="/" className="back-btn">← Back</Link>
        <h2 className="page__title">Create Account</h2>
        <p className="page__subtitle">Register with your Gmail or personal email</p>
      </div>

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form__group">
          <label className="form__label">Full Name</label>
          <input
            className={`form__input${errors.fullName ? ' form__input--error' : ''}`}
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            {...register('fullName')}
          />
          {errors.fullName && <p className="form__error">{errors.fullName.message}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Email Address</label>
          <input
            className={`form__input${errors.email ? ' form__input--error' : ''}`}
            type="email"
            placeholder="you@gmail.com or you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className="form__error">{errors.email.message}</p>}
          <p className="form__hint">✉️ We'll send a one-time password to this address via Gmail.</p>
        </div>

        <div className="form__group">
          <label className="form__label">Password</label>
          <div className="form__input-wrapper">
            <input
              className={`form__input${errors.password ? ' form__input--error' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              {...register('password')}
            />
            <button
              type="button"
              className="form__toggle-pw"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <p className="form__error">{errors.password.message}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Confirm Password</label>
          <div className="form__input-wrapper">
            <input
              className={`form__input${errors.confirmPassword ? ' form__input--error' : ''}`}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="form__toggle-pw"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <p className="form__error">{errors.confirmPassword.message}</p>}
        </div>

        <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
          {loading ? 'Sending OTP…' : 'Send OTP & Continue'}
        </button>
      </form>

      <p className="page__footer-note">
        By registering you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
