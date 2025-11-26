# Employee & Task Management API

Node.js + Express REST API that powers the Next.js Employee & Task Management frontend. Includes JWT authentication, MongoDB persistence via Mongoose, validation, and sample seed data.

## Prerequisites

- Node.js 18+
- MongoDB instance (local or hosted)

## Environment

1. Copy `.env.example` to `.env` and update values as needed.

```bash
cp .env.example .env # use copy command on Windows
```

Required variables:

- `PORT` – API port (defaults to 5000)
- `MONGO_URI` – MongoDB connection string
- `MONGO_DB_NAME` – Database name
- `JWT_SECRET` – Secret used to sign tokens
- `CLIENT_ORIGIN` – Comma-separated list of allowed origins

## Install & Run

```bash
npm install
npm run dev    # starts nodemon with auto reload
# or
npm start      # starts production server
```

## Seed Sample Data

```bash
npm run seed
```

Creates demo employees, tasks, and a default admin user (`admin@example.com` / `ChangeMe123!`).

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/validate`

### Employees (protected)
- `GET /employees` (supports `status`, `department`, `search` query params)
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`

### Tasks (protected)
- `GET /tasks` (supports `status`, `assignedEmployeeId` query params)
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

All protected routes require `Authorization: Bearer <token>` header from a successful login or registration.
