# Gadget Fix

A full-stack web application for gadget repair services.

## Tech Stack

- **Frontend**: Next.js (App Router), React, MUI v5
- **Backend**: Next.js API Routes, Mongoose, JWT Auth
- **Database**: MongoDB

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables in `.env.local` (already created):
    ```env
    MONGODB_URI=mongodb://127.0.0.1:27017/gadget-fix
    JWT_SECRET=supersecretkey_change_this_for_prod
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Features Implemented

- [x] Authentication (Login, Register with JWT & Cookies)
- [x] Role-Based Access Control (User, Admin, Technician)
- [x] Dynamic Dashboard Layout (Sidebar based on Role)
- [x] Database Models (User, Booking, Tech, Pricing, etc.)
- [x] Admin User Management (DataGrid)
- [ ] Booking Flow (Partial)
- [ ] Payment Integration (Pending)

## Getting Started

1.  **Register**: Go to `/auth/register` and create an account.
2.  **Login**: Login with your credentials. default role is 'user'.
3.  **Admin Access**:
    - Since there is no "Super Admin" creation flow yet, you must manually update the user role in MongoDB.
    - Connect to MongoDB: `use gadget-fix` -> `db.users.updateOne({email: "your-email"}, {$set: {role: "admin"}})`
    - Logout and Login again to access the Admin Dashboard.
