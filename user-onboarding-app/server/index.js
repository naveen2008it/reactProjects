/**
 * OnboardMe – Express API server
 *
 * Environment variables (create a .env file in this directory):
 *   PORT            – server port (default 5001)
 *   GMAIL_USER      – your Gmail address (e.g. yourname@gmail.com)
 *   GMAIL_APP_PASS  – Gmail App Password (16-char, spaces removed)
 *                     Generate one at: https://myaccount.google.com/apppasswords
 *   OTP_EXPIRY_MS   – OTP validity in ms (default 600000 = 10 min)
 *   CLIENT_ORIGIN   – React dev server origin (default http://localhost:3000)
 */

require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;
const OTP_EXPIRY_MS = Number(process.env.OTP_EXPIRY_MS) || 10 * 60 * 1000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

/* ── In-memory stores (replace with a real DB in production) ── */
const otpStore = new Map();   // email → { otp, expiresAt }
const userStore = new Map();  // email → user object

/* ── Nodemailer transport ─────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    // Strip spaces so the .env.example hint (spaces are fine) works correctly
    pass: (process.env.GMAIL_APP_PASS || '').replace(/\s/g, ''),
  },
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

/* ── POST /auth/send-otp ──────────────────────────────────── */
app.post('/auth/send-otp', async (req, res) => {
  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send('A valid email is required');
  }

  const otp = generateOtp();
  otpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });

  const gmailConfigured = process.env.GMAIL_USER && process.env.GMAIL_APP_PASS;

  if (gmailConfigured) {
    try {
      await transporter.sendMail({
        from: `"OnboardMe" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your OnboardMe OTP',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#4f46e5">Your One-Time Password</h2>
            <p>Use the following OTP to complete your registration.</p>
            <div style="font-size:2.5rem;font-weight:700;letter-spacing:.25em;
                        color:#4f46e5;background:#eef2ff;border-radius:12px;
                        padding:20px;text-align:center;margin:24px 0">
              ${otp}
            </div>
            <p style="color:#64748b">This code expires in <strong>10 minutes</strong>.<br>
            If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Email send error:', err.message);
      return res.status(502).send('Failed to send OTP email. Check server Gmail configuration.');
    }
  } else {
    /* Development fallback: log the OTP to the console */
    console.log(`[DEV] OTP for ${email}: ${otp}`);
  }

  res.json({ message: 'OTP sent', dev: !gmailConfigured ? { otp } : undefined });
});

/* ── POST /auth/verify-otp ────────────────────────────────── */
app.post('/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).send('Email and OTP are required');
  }

  const record = otpStore.get(email.toLowerCase());
  if (!record) {
    return res.status(400).send('No OTP found for this email. Please request a new one.');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).send('OTP has expired. Please request a new one.');
  }

  if (record.otp !== String(otp)) {
    return res.status(400).send('Invalid OTP. Please try again.');
  }

  otpStore.delete(email.toLowerCase());
  res.json({ message: 'OTP verified' });
});

/* ── POST /auth/register ──────────────────────────────────── */
app.post('/auth/register', async (req, res) => {
  const { fullName, email, password } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).send('fullName, email, and password are required');
  }

  const key = email.toLowerCase();
  if (userStore.has(key)) {
    return res.status(409).send('An account with this email already exists');
  }

  const user = {
    id: uuidv4(),
    fullName,
    email: key,
    createdAt: new Date().toISOString(),
  };
  const hashedPassword = await bcrypt.hash(password, 10);
  userStore.set(key, { ...user, password: hashedPassword });

  const gmailConfigured = process.env.GMAIL_USER && process.env.GMAIL_APP_PASS;
  if (gmailConfigured) {
    try {
      await transporter.sendMail({
        from: `"OnboardMe" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Welcome to OnboardMe! 🎉',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#4f46e5">Welcome, ${escapeHtml(fullName)}! 🚀</h2>
            <p>Your account has been successfully created.</p>
            <p>You can now log in and explore your personalised dashboard.</p>
            <div style="margin:24px 0">
              <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}"
                 style="background:#4f46e5;color:#fff;padding:14px 28px;
                        border-radius:10px;text-decoration:none;font-weight:600">
                Go to Dashboard
              </a>
            </div>
            <p style="color:#64748b;font-size:0.875rem">
              If you did not register, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.warn('Welcome email failed:', err.message);
    }
  }

  res.status(201).json({ message: 'Registration successful', user });
});

/* ── Health check ─────────────────────────────────────────── */
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`OnboardMe API running on http://localhost:${PORT}`);
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    console.warn('⚠  Gmail credentials not set – OTPs will be logged to console (dev mode)');
  }
});
