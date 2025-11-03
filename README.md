# ApnaParivar (MERN + React Flow + Razorpay)

Professional MERN app to manage multi-family trees with Gmail-only auth, role-based admin (admin1-3), viewers, search, and subscriptions (free first year, then ₹500/year) via Razorpay.

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose), Passport Google OAuth, JWT, Razorpay
- Frontend: React (Vite), React Router, React Flow

## Dev Setup

Backend:
```
cd server
npm install
# copy and configure .env from .env.example
npm run dev
```

Frontend:
```
cd client
npm install
npm run dev
```

Configure Google OAuth and Razorpay keys, and set CLIENT_ORIGIN to the frontend URL (default http://localhost:5173).

## Key Features
- Gmail-only sign-in (Google OAuth)
- Superadmin and per-family roles: admin1, admin2, admin3, viewer
- Only admins can add entries/photos/details; viewers can see details
- Members support up to 10 custom fields per family configuration
- Search by name and keyword
- Multi-family support within one tenant
- Free for first year per family; then ₹500/year paid to Superadmin via Razorpay

## Notes
- Initial layout of family tree is random positions; can be enhanced to compute generations and tidy layouts.
- Add file storage for photos (S3/Cloudinary) in production.


