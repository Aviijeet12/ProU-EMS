const Employee = require("../models/Employee");

exports.getEmployees = async (req, res) => {
  try {
    // admin gets all
    if (req.user.role === "admin") {
      const employees = await Employee.find().populate("owner", "name email");
      return res.json({ success: true, data: employees });
    }

    // user gets only their own
    const employees = await Employee.find({ owner: req.user._id });
    return res.json({ success: true, data: employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, position } = req.body;

    const employee = await Employee.create({
      name,
      email,
      phone,
      position,
      owner: req.user._id,
    });

    return res.status(201).json({ success: true, data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);

    if (!emp)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && emp.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, data: emp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);

    if (!emp)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && emp.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    Object.assign(emp, req.body);
    await emp.save();

    return res.json({ success: true, data: emp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);

    if (!emp)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role !== "admin" && emp.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await emp.deleteOne();
    return res.json({ success: true, message: "Employee deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
