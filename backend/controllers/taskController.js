const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    // admin sees all tasks
    let filter = {};
    if (req.user.role === "admin") {
      filter = {};
    } else {
      // Find tasks where this user is the assignee (via employeeId) OR owner
      const Employee = require("../models/Employee");
      const employee = await Employee.findOne({ owner: req.user._id });
      if (employee) {
        // Return tasks assigned to this employee OR tasks where owner is this user
        filter = {
          $or: [
            { assignee: employee._id },
            { owner: req.user._id }
          ]
        };
      } else {
        // Return tasks where owner is this user (for demo tasks)
        filter = { owner: req.user._id };
      }
    }

    console.log('DEBUG getTasks user:', req.user);
    console.log('DEBUG getTasks filter:', JSON.stringify(filter));
    const tasks = await Task.find(filter).populate("assignee").populate("owner");
    console.log('DEBUG getTasks returned:', tasks.map(t => ({_id: t._id, title: t.title, assignee: t.assignee, owner: t.owner})));

    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const payload = { ...req.body, owner: req.user._id };
    // Ensure assignee is a valid ObjectId string
    if (payload.assignee && typeof payload.assignee === "string") {
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(payload.assignee)) {
        payload.assignee = new mongoose.Types.ObjectId(payload.assignee);
      } else {
        payload.assignee = undefined;
      }
    }

    const task = await Task.create(payload);

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ success: false, message: "Not found" });

    // Allow update if user is admin, owner, or assignee
    const Employee = require("../models/Employee");
    let isAssignee = false;
    if (task.assignee) {
      const employee = await Employee.findOne({ owner: req.user._id });
      if (employee && (task.assignee.toString() === employee._id.toString())) {
        isAssignee = true;
      }
    }
    if (
      req.user.role !== "admin" &&
      task.owner.toString() !== req.user._id.toString() &&
      !isAssignee
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Ensure assignee is a valid ObjectId string
    if (req.body.assignee && typeof req.body.assignee === "string") {
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(req.body.assignee)) {
        req.body.assignee = new mongoose.Types.ObjectId(req.body.assignee);
      } else {
        req.body.assignee = undefined;
      }
    }
    Object.assign(task, req.body);
    await task.save();

    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await task.deleteOne();

    return res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
