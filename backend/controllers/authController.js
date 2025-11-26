import { validationResult } from 'express-validator';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const result = await registerUser(req.body);
    res.status(201).json(new ApiResponse({ statusCode: 201, message: 'User registered', data: result }));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const result = await loginUser(req.body);
    res.json(new ApiResponse({ message: 'Login successful', data: result }));
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req, res) => {
  res.json(new ApiResponse({ message: 'Token valid', data: { user: req.user } }));
};
