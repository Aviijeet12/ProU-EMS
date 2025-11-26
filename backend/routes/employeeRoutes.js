import { Router } from 'express';
import { body } from 'express-validator';

import {
  listEmployees,
  getEmployee,
  createEmployeeHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
} from '../controllers/employeeController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * ✅ Protect ALL employee routes with JWT auth
 */
router.use(authMiddleware);

/**
 * ✅ Validation rules
 */
const createEmployeeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'On Leave'])
    .withMessage('Invalid status'),
];

const updateEmployeeValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().notEmpty().withMessage('Role cannot be empty'),
  body('department').optional().notEmpty().withMessage('Department cannot be empty'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'On Leave'])
    .withMessage('Invalid status'),
];

/**
 * ✅ Routes remain the same but now guaranteed to be user-scoped
 */
router.get('/', listEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployeeValidation, createEmployeeHandler);
router.put('/:id', updateEmployeeValidation, updateEmployeeHandler);
router.delete('/:id', deleteEmployeeHandler);

export default router;
