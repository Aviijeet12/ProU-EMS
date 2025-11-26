
# Employee Task Management System

A full-stack web application for managing employees and tasks, featuring authentication, CRUD operations, and per-user sample data. Built with Next.js (React), Express.js, and MongoDB.

---

## Features

- **User Authentication**: Register, login, JWT-based session management
- **Employee Management**: Add, edit, delete, and view employees
- **Task Management**: Assign, update, delete, and track tasks
- **Per-User Sample Data**: New users see demo employees and tasks after registration
- **Role-based Access**: Admin/user roles (extensible)
- **Responsive UI**: Modern design with shadcn and Radix UI components
- **API Integration**: Frontend uses REST API for all data operations

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, shadcn, Radix UI
- **Backend**: Node.js 18+, Express.js, MongoDB (Mongoose ODM)
- **Auth**: JWT, bcrypt
- **Dev Tools**: nodemon, morgan, dotenv

---

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

---

## Sample Data
- On registration, each user receives demo employees and tasks for a quick start.

---

## Troubleshooting
- **Port conflicts**: Ensure only one backend server runs on port 5000. Use `npx kill-port 5000` if needed.
- **CORS errors**: Check `FRONTEND_ORIGIN` in backend `.env` and allowed origins in `server.js`.
- **MongoDB connection**: Verify `MONGO_URI` in backend `.env`.

---

## License
MIT

---

## Author
Avijit Singh
