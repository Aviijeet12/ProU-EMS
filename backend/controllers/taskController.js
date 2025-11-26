import { validationResult } from 'express-validator';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService.js';

/**
 * ✅ List tasks belonging ONLY to logged-in user
 */
export const listTasks = async (req, res, next) => {
  try {
    const tasks = await getTasks({
      ...req.query,
      userId: req.user.id,
    });

    res.json(new ApiResponse({ data: tasks }));
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Get single task but ensure it belongs to the user
 */
export const getTask = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id, req.user.id);

    res.json(new ApiResponse({ data: task }));
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Create task and attach logged-in user ID
 */
export const createTaskHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const task = await createTask(req.body, req.user.id);

    res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: 'Task created',
        data: task,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Update only if task belongs to logged-in user
 */
export const updateTaskHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const task = await updateTask(req.params.id, req.body, req.user.id);

    res.json(new ApiResponse({ message: 'Task updated', data: task }));
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Delete only if task belongs to logged-in user
 */
export const deleteTaskHandler = async (req, res, next) => {
  try {
    await deleteTask(req.params.id, req.user.id);

    res.json(new ApiResponse({ message: 'Task deleted' }));
  } catch (error) {
    next(error);
  }
};
