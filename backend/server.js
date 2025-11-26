import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const envOrigins =
  process.env.FRONTEND_ORIGIN ||
  process.env.FRONTEND_URL ||
  process.env.VERCEL_URL;

const parsedOrigins = envOrigins
  ? envOrigins
      .split(',')
      .map((origin) =>
        origin.startsWith('http')
          ? origin.trim()
          : `https://${origin.trim()}`
      )
      .filter(Boolean)
  : [];


const allowedOrigins = parsedOrigins.length ? parsedOrigins : defaultAllowedOrigins;

console.log('DEBUG — Allowed Origins:', allowedOrigins);

// Tighten CORS so only known origins are allowed during development
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`Blocked CORS origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Parsers and logging
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Mount backend API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Port config
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // IMPORTANT: only listen once and ONLY using Render's port
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
