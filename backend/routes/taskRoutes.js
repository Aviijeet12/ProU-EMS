import { Router } from 'express';
import { body } from 'express-validator';
import {
  listTasks,
  getTask,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

const createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('dueDate').isISO8601().withMessage('dueDate must be a valid date'),
  body('status')
    .optional()
    .isIn(['Pending', 'In-progress', 'Completed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('assignedEmployeeId').isMongoId().withMessage('assignedEmployeeId must be a valid id'),
];

const updateTaskValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date'),
  body('status')
    .optional()
    .isIn(['Pending', 'In-progress', 'Completed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('assignedEmployeeId')
    .optional()
    .isMongoId()
    .withMessage('assignedEmployeeId must be a valid id'),
];

router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', createTaskValidation, createTaskHandler);
router.put('/:id', updateTaskValidation, updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
