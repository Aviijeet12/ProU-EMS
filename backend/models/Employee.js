const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String },

    phone: { type: String },

    position: { type: String },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // user who owns this data — for per-user sample data
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
