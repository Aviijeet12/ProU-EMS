const Task = require("../models/Task");

exports.createTask = async (data) => {
  return await Task.create(data);
};

exports.getTasksByOwner = async (ownerId) => {
  return await Task.find({ owner: ownerId });
};
