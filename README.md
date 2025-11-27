
# ProU-EMS: Employee Task Management System

## Overview
ProU-EMS is a full-stack web application for managing employees and tasks. It features secure authentication, role-based dashboards, and real-time task tracking for admins and employees.

## Features
- Secure registration and login (JWT)
- Admin dashboard: manage employees and assign tasks
- Employee dashboard: view, start, and complete assigned tasks
- Demo data for new users
- Responsive, modern UI

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)

## Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aviijeet12/ProU-EMS.git
   cd ProU-EMS
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Configure environment variables:**
   - Set up `.env` files in both `backend` and `frontend` folders (see `.env.example`).
4. **Start servers:**
   ```bash
   cd backend && pnpm run dev
   cd ../frontend && pnpm run dev
   ```
5. **Open the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

## Usage
- **Admin:** Add/edit employees, assign tasks
- **Employee:** View and update assigned tasks

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT token secret
- `FRONTEND_ORIGINS`: Allowed frontend URLs
- `PORT`: Backend port

## API Endpoints
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/validate` — Validate JWT
- `GET /api/employees` — List employees
- `POST /api/employees` — Add employee
- `PUT /api/employees/:id` — Update employee
- `DELETE /api/employees/:id` — Delete employee
- `GET /api/tasks` — List tasks
- `POST /api/tasks` — Add task
- `PUT /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task

## Sample Data
- On registration, each user receives demo employees and tasks for a quick start.

## Troubleshooting
- **Port conflicts**: Ensure only one backend server runs on port 5000. Use `npx kill-port 5000` if needed.
- **CORS errors**: Check `FRONTEND_ORIGIN` in backend `.env` and allowed origins in `server.js`.
- **MongoDB connection**: Verify `MONGO_URI` in backend `.env`.

## Project Structure

```
├── frontend/
│   ├── app/                # Next.js app directory (pages, layouts, protected routes)
│   ├── components/         # Reusable UI and feature components
│   ├── context/            # React context for auth and data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   ├── styles/             # Global CSS
│   └── ...
├── backend/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic and sample data seeding
│   ├── utils/          # Helper utilities
│   ├── config/         # DB connection
│   └── server.js       # Main server entrypoint
├── .env.local          # Frontend environment config
├── backend/.env        # Backend environment config
├── package.json        # Project dependencies
├── README.md           # Project documentation
```

---

## Setup & Installation

### 1. Clone the repository
```sh
git clone <repo-url>
cd employee-task-management
```

### 2. Install dependencies
```sh
pnpm install
cd backend
npm install
```

### 3. Configure environment variables
- **Frontend**: Edit `.env.local` (API base URL)
- **Backend**: Edit `backend/.env` (MongoDB URI, JWT secret, allowed origins)

### 4. Start development servers
- **Backend**:
  ```sh
  cd backend
  npm run dev
  ```
- **Frontend**:
  ```sh
  pnpm dev
  ```

---

## Author
Avijit Singh
