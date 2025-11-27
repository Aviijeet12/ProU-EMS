require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
console.log('DEBUG MONGO_URI:', process.env.MONGO_URI);
console.log('DEBUG CWD:', process.cwd());
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Task = require("../models/Task");
const bcrypt = require("bcrypt");

async function seedDemoData() {
  await connectDB();

  // Find or create admin user
  let admin = await User.findOne({ email: "admin@system.com" });
  if (!admin) {
    const hashed = await bcrypt.hash("123456", 10);
    admin = await User.create({
      name: "Super Admin",
      email: "admin@system.com",
      password: hashed,
      role: "admin",
    });
    console.log("Admin created.");
  }

  // Remove previous demo employees/tasks for this admin
  await Employee.deleteMany({ owner: admin._id });
  await Task.deleteMany({ owner: admin._id });

  // Create demo employees
  const employees = await Employee.insertMany([
    { name: "John Russell", email: "john.russell@example.com", phone: "9876543210", position: "Software Developer", owner: admin._id, status: "active" },
    { name: "Priya Sharma", email: "priya.sharma@example.com", phone: "9123456780", position: "Frontend Engineer", owner: admin._id, status: "active" },
    { name: "Michael Tan", email: "michael.tan@example.com", phone: "9988776655", position: "Backend Developer", owner: admin._id, status: "active" },
    { name: "Sarah Williams", email: "sarah.williams@example.com", phone: "9090909090", position: "UI/UX Designer", owner: admin._id, status: "active" },
    { name: "David Miller", email: "david.miller@example.com", phone: "9012345678", position: "QA Analyst", owner: admin._id, status: "active" },
    { name: "Emily Brown", email: "emily.brown@example.com", phone: "9080706050", position: "Project Manager", owner: admin._id, status: "active" },
    { name: "Arjun Patel", email: "arjun.patel@example.com", phone: "9098765432", position: "DevOps Engineer", owner: admin._id, status: "active" },
    { name: "Lisa Chow", email: "lisa.chow@example.com", phone: "9001122334", position: "Business Analyst", owner: admin._id, status: "active" },
  ]);

  // Assign tasks to employees
  const employeeIds = employees.map((e) => e._id);
  await Task.insertMany([
    { title: "Fix Login Redirect Bug", description: "Investigate and fix incorrect redirection after login.", assignee: employeeIds[0], status: "in-progress", owner: admin._id, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    { title: "Update Landing Page UI", description: "Revamp hero section and align CTA buttons.", assignee: employeeIds[1], status: "todo", owner: admin._id, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    { title: "API Documentation", description: "Document employee CRUD operations in internal wiki.", assignee: employeeIds[2], status: "done", owner: admin._id, dueDate: new Date() },
    { title: "UI Revision Round 2", description: "Apply feedback from client review meeting.", assignee: employeeIds[3], status: "in-progress", owner: admin._id, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { title: "Write Unit Tests for User Module", description: "Increase test coverage for authentication service.", assignee: employeeIds[4], status: "todo", owner: admin._id, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { title: "Deployment Pipeline Optimization", description: "Reduce build time and optimize Docker layers.", assignee: employeeIds[6], status: "in-progress", owner: admin._id, dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
    { title: "Prepare Client Report", description: "Summarize project progress for Friday presentation.", assignee: employeeIds[5], status: "todo", owner: admin._id, dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    { title: "Database Schema Review", description: "Evaluate schema relationships and propose improvements.", assignee: employeeIds[7], status: "todo", owner: admin._id, dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
    { title: "Conduct Standup Meeting", description: "Lead daily standup for frontend team.", assignee: employeeIds[1], status: "done", owner: admin._id, dueDate: new Date() },
    { title: "UI Accessibility Fixes", description: "Improve color contrast and add ARIA labels.", assignee: employeeIds[3], status: "in-progress", owner: admin._id, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  ]);

  console.log("Demo employees and tasks seeded for admin.");
  process.exit(0);
}

seedDemoData();
