# ApnaParivar Server

MERN backend for ApnaParivar: Google-only auth, families, members, RBAC, search, and Razorpay billing.

## Setup

1. Copy environment variables:

```
cp .env.example .env
```

Then set:
- PORT
- MONGODB_URI
- CLIENT_ORIGIN (e.g. http://localhost:5173)
- JWT_SECRET
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- SUPERADMIN_EMAIL

2. Install & run

```
npm install
npm run dev
```

## Auth
- Only `@gmail.com` emails via Google OAuth allowed
- Backend issues JWT on callback and redirects to `CLIENT_ORIGIN` `/auth/callback?token=...`

## Roles
- `superadmin` (global)
- Per family: `admin1`, `admin2`, `admin3`, `viewer`

## Billing
- First year free per family; then INR 500/year via Razorpay


