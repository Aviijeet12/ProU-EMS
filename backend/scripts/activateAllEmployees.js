require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Employee = require("../models/Employee");

async function activateAllEmployees() {
  await connectDB();
  const result = await Employee.updateMany({}, { $set: { status: "active" } });
  console.log(`Updated ${result.modifiedCount} employees to active.`);
  process.exit(0);
}

activateAllEmployees();
