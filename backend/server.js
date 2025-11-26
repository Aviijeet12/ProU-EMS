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

// Explicit allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

console.log("DEBUG — Allowed Origins:", allowedOrigins);

// CORS config
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Parsers and logging
app.use(express.json());
app.use(morgan('dev'));

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
