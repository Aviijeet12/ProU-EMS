require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const connectDB = require("../config/db");

async function createAdmin() {
  try {
    await connectDB();

    const email = "admin@system.com";
    const password = "123456"; // FIXED PASSWORD YOU REQUESTED

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists:");
      console.log(exists);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Super Admin",
      email,
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
