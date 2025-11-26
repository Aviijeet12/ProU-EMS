import Task from '../models/Task.js';
import Employee from '../models/Employee.js';
import ApiError from '../utils/ApiError.js';

/**
 * Ensure assigned employee belongs to logged-in user
 */
const ensureEmployeeBelongsToUser = async (employeeId, userId) => {
  const employee = await Employee.findOne({ _id: employeeId, createdBy: userId });

  if (!employee) {
    throw new ApiError(400, 'Assigned employee does not exist or access denied');
  }
};

/**
 * Get tasks belonging ONLY to logged-in user
 */
export const getTasks = async ({ status, assignedEmployeeId, userId }) => {
  const query = { createdBy: userId };

  if (status) {
    query.status = status;
  }

  if (assignedEmployeeId) {
    query.assignedEmployeeId = assignedEmployeeId;
  }

  return Task.find(query)
    .populate('assignedEmployeeId', 'name email role department')
    .sort({ createdAt: -1 });
};

/**
 * Get single task and ensure user owns it
 */
export const getTaskById = async (id, userId) => {
  const task = await Task.findOne({ _id: id, createdBy: userId })
    .populate('assignedEmployeeId', 'name email role department');

  if (!task) {
    throw new ApiError(404, 'Task not found or access denied');
  }

  return task;
};

/**
 * Create task and attach user ownership
 */
export const createTask = async (data, userId) => {
  await ensureEmployeeBelongsToUser(data.assignedEmployeeId, userId);

  const task = await Task.create({
    ...data,
    createdBy: userId,
  });

  return task.populate('assignedEmployeeId', 'name email role department');
};

/**
 * Update task ONLY if owned by logged-in user
 */
export const updateTask = async (id, updates, userId) => {
  if (updates.assignedEmployeeId) {
    await ensureEmployeeBelongsToUser(updates.assignedEmployeeId, userId);
  }

  const task = await Task.findOneAndUpdate(
    { _id: id, createdBy: userId },
    updates,
    { new: true, runValidators: true }
  ).populate('assignedEmployeeId', 'name email role department');

  if (!task) {
    throw new ApiError(404, 'Task not found or access denied');
  }

  return task;
};

/**
 * Delete task ONLY if owned by logged-in user
 */
export const deleteTask = async (id, userId) => {
  const task = await Task.findOneAndDelete({
    _id: id,
    createdBy: userId,
  });

  if (!task) {
    throw new ApiError(404, 'Task not found or access denied');
  }

  return task;
};
