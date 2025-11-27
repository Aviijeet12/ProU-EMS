require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// DB connection
connectDB();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// FIXED CORS (No dynamic origin logic)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);

// Error middleware
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on Render on port ${PORT}`)
);
