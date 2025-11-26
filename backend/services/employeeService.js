import Employee from '../models/Employee.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get employees belonging ONLY to logged-in user
 */
export const getEmployees = async ({ status, department, search, userId }) => {
  const query = { createdBy: userId };

  if (status) {
    query.status = status;
  }
  if (department) {
    query.department = department;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  return Employee.find(query).sort({ createdAt: -1 });
};

/**
 * Get a single employee ensuring it belongs to logged-in user
 */
export const getEmployeeById = async (id, userId) => {
  const employee = await Employee.findOne({ _id: id, createdBy: userId });
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
};

/**
 * Create employee assigned to logged-in user
 */
export const createEmployee = async (data, userId) => {
  const existing = await Employee.findOne({ email: data.email, createdBy: userId });
  if (existing) {
    throw new ApiError(400, 'Employee email already exists');
  }

  return Employee.create({ ...data, createdBy: userId });
};

/**
 * Update employee only if owned by logged-in user
 */
export const updateEmployee = async (id, updates, userId) => {
  if (updates.email) {
    const duplicate = await Employee.findOne({
      email: updates.email,
      createdBy: userId,
      _id: { $ne: id },
    });

    if (duplicate) {
      throw new ApiError(400, 'Employee email already exists');
    }
  }

  const employee = await Employee.findOneAndUpdate(
    { _id: id, createdBy: userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }

  return employee;
};

/**
 * Delete employee only if owned by logged-in user
 */
export const deleteEmployee = async (id, userId) => {
  const employee = await Employee.findOneAndDelete({ _id: id, createdBy: userId });
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
};
