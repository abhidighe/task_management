import express from 'express';
import {
  createTask,
  deleteTaskById,
  getTaskById,
  listTasks,
  updateTaskById,
} from '../controllers/taskController';

const router = express.Router();

router.get('/', listTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTaskById);
router.delete('/:id', deleteTaskById);

export default router;
