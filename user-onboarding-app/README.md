# OnboardMe – User Onboarding & Dashboard App

A **mobile-first React web application** for user onboarding with email OTP
verification (powered by Gmail) and a personalised landing dashboard with
bottom-tab menu navigation.

---

## Features

| Feature | Details |
|---------|---------|
| **Registration** | Full name, email (Gmail / personal), password with strength rules |
| **Email validation** | Gmail and personal domains allowed; throwaway/disposable addresses blocked |
| **OTP via Gmail** | 6-digit OTP sent through your Gmail account using Nodemailer + App Password |
| **OTP screen** | Auto-advance cells, paste support, resend, 10-min expiry |
| **Landing dashboard** | Stat cards, quick actions, recent activity, personalised greeting |
| **Bottom navigation** | Home · Profile · Flow Chart · Settings · Logout |
| **Profile page** | Displays user info and account status |
| **Settings page** | Toggle switches for notifications, privacy, appearance |
| **Onboarding flow chart** | Interactive step-by-step visual diagram of the full flow |
| **Protected routes** | Dashboard, Profile, Settings require authentication |

---

## Project Structure

```
user-onboarding-app/
├── public/
│   └── index.html
├── server/
│   ├── index.js          ← Express API (OTP + registration)
│   └── .env.example      ← Environment variable template
├── src/
│   ├── App.js
│   ├── index.js
│   ├── styles.css
│   ├── app/
│   │   └── store.js
│   ├── features/
│   │   └── auth/
│   │       └── authSlice.js
│   ├── components/
│   │   ├── MobileShell.jsx
│   │   └── BottomNav.jsx
│   ├── pages/
│   │   ├── WelcomePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── OtpVerifyPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── FlowChartPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   └── api.js
│   └── utils/
│       └── validators.js
└── package.json
```

---

## Functional Flow Chart

```
App Launch
    │
    ▼
Welcome Screen  ──────────────────────────────►  [View Onboarding Flow]
    │
    ▼
Registration Form  (Full Name · Email · Password)
    │
    ▼
Email Valid? ──── No ──► Inline error → user corrects
    │
   Yes
    │
    ▼
POST /auth/send-otp
    │
    ▼
Gmail dispatches 6-digit OTP email
    │
    ▼
OTP Entry Screen  (6 cells · paste support · Resend)
    │
    ▼
OTP Correct & Not Expired? ──── No ──► Error toast → retry / resend
    │
   Yes
    │
    ▼
POST /auth/register  →  user record created
    │
    ▼
Gmail sends Welcome email notification
    │
    ▼
Landing Dashboard  (stats · quick actions · recent activity)
    │
    ▼
Bottom Navigation  [Home | Profile | Flow | Settings | Logout]
```

---

## Gmail Setup (required for real OTP sending)

1. Enable **2-Step Verification** on your Google account.
2. Go to <https://myaccount.google.com/apppasswords>.
3. Create an App Password for **Mail** → copy the 16-character code.
4. Copy `server/.env.example` → `server/.env` and fill in:

```env
GMAIL_USER=yourname@gmail.com
GMAIL_APP_PASS=xxxx xxxx xxxx xxxx   # spaces are fine, they're stripped
```

> **Development mode** (no `.env`): OTPs are printed to the server console
> so you can still test the full flow without Gmail credentials.

---

## Running Locally

```bash
cd user-onboarding-app

# Install all dependencies
npm install

# Start both the API server and React dev server
npm run dev

# Or separately:
npm run server   # Express API on http://localhost:5001
npm start        # React app  on http://localhost:3000
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/send-otp` | Generate & email a 6-digit OTP |
| `POST` | `/auth/verify-otp` | Validate OTP (10-min window) |
| `POST` | `/auth/register` | Create account + send welcome email |
| `GET`  | `/health` | Server health check |

### Request / Response Examples

**POST /auth/send-otp**
```json
// Request
{ "email": "user@gmail.com" }

// Response 200
{ "message": "OTP sent" }
// In dev mode (no Gmail creds), also includes:
{ "message": "OTP sent", "dev": { "otp": "482910" } }
```

**POST /auth/verify-otp**
```json
// Request
{ "email": "user@gmail.com", "otp": "482910" }

// Response 200
{ "message": "OTP verified" }
```

**POST /auth/register**
```json
// Request
{ "fullName": "Jane Doe", "email": "user@gmail.com", "password": "Secret1!" }

// Response 201
{
  "message": "Registration successful",
  "user": { "id": "uuid", "fullName": "Jane Doe", "email": "user@gmail.com", "createdAt": "..." }
}
```
