import { validationResult } from 'express-validator';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Employee from '../models/Employee.js';

// ✅ List only employees belonging to logged-in user
export const listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(new ApiResponse({ data: employees }));
  } catch (error) {
    next(error);
  }
};

// ✅ Get single employee but ensure it belongs to the user
export const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!employee) {
      throw new ApiError(404, 'Employee not found or access denied');
    }

    res.json(new ApiResponse({ data: employee }));
  } catch (error) {
    next(error);
  }
};

// ✅ Create employee and attach logged-in user ID
export const createEmployeeHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const newEmployee = new Employee({
      ...req.body,
      createdBy: req.user.id, // IMPORTANT
    });

    const employee = await newEmployee.save();

    res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: 'Employee created',
        data: employee,
      })
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Update only if employee belongs to logged-in user
export const updateEmployeeHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!employee) {
      throw new ApiError(404, 'Employee not found or access denied');
    }

    res.json(new ApiResponse({ message: 'Employee updated', data: employee }));
  } catch (error) {
    next(error);
  }
};

// ✅ Delete only if employee belongs to logged-in user
export const deleteEmployeeHandler = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!employee) {
      throw new ApiError(404, 'Employee not found or access denied');
    }

    res.json(new ApiResponse({ message: 'Employee deleted' }));
  } catch (error) {
    next(error);
  }
};
