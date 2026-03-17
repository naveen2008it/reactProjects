import * as yup from 'yup';

export const emailValidation = yup
  .string()
  .trim()
  .required('Email is required')
  .email('Enter a valid email address')
  .test('no-disposable', 'Please use a valid email address (temporary/disposable email services are not allowed)', (value) => {
    if (!value) return false;
    const blocked = [
      'mailinator.com', 'guerrillamail.com', 'trashmail.com', 'tempmail.com',
      'throwaway.email', 'yopmail.com', 'sharklasers.com', 'dispostable.com',
      'maildrop.cc', 'fakeinbox.com',
    ];
    const domain = value.split('@')[1]?.toLowerCase();
    return domain ? !blocked.includes(domain) : false;
  });

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: emailValidation,
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});
