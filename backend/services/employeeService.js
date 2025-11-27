const Employee = require("../models/Employee");

exports.createEmployee = async (data) => {
  return await Employee.create(data);
};

exports.getEmployeesByOwner = async (ownerId) => {
  return await Employee.find({ owner: ownerId });
};
