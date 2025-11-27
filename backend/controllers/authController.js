const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER (always normal user)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    // Always create Employee record for new user
    const Employee = require("../models/Employee");
    let employee = await Employee.findOne({ owner: user._id });
    if (!employee) {
      employee = await Employee.create({
        name,
        email,
        owner: user._id,
        status: "active",
        position: "Employee"
      });
    }

    // Always assign demo tasks to this employee and user
    const Task = require("../models/Task");
    const demoTasks = [
      {
        title: "Welcome Task",
        description: "Get started by updating your profile.",
        assignee: employee._id,
        status: "todo",
        owner: user._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Read Company Handbook",
        description: "Review the employee handbook and policies.",
        assignee: employee._id,
        status: "in-progress",
        owner: user._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Setup Workstation",
        description: "Configure your development environment.",
        assignee: employee._id,
        status: "todo",
        owner: user._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    ];
    // Remove any previous demo tasks for this user/employee
    await Task.deleteMany({ owner: user._id });
    await Task.insertMany(demoTasks);

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: employee._id,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// VALIDATE
exports.validate = async (req, res) => {
  try {
    // authMiddleware attaches req.user (without password)
    if (!req.user) return res.status(401).json({ success: false, message: "Invalid token" });

    return res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    console.error("Validate error:", err);
    return res.status(500).json({ success: false, message: "Validation failed" });
  }
};
