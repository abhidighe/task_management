import { Request, Response, NextFunction } from 'express';
import {
  createTaskItem,
  deleteTask,
  findTaskById,
  getAllTasks,
  updateTask,
} from '../urtils/taskStore';
import { validateTaskPayload } from '../urtils/validation';

const DELETE_AUTH_HEADER = process.env.DELETE_AUTH_HEADER ?? 'X-Delete-Auth';
const DELETE_AUTH_TOKEN = process.env.DELETE_AUTH_TOKEN ?? 'task-manager-delete';

const jsonResponse = (res: Response, status: number, payload: unknown) => res.status(status).json(payload);

export const listTasks = (req: Request, res: Response) => {
  const { priority, status } = req.query;
  let tasks = getAllTasks();

  if (typeof priority === 'string') {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  if (typeof status === 'string') {
    tasks = tasks.filter((task) => task.status === status);
  }

  return jsonResponse(res, 200, { success: true, data: tasks });
};

export const getTaskById = (req: Request, res: Response, next: NextFunction) => {
  const id = String(req.params.id);
  const task = findTaskById(id);
  if (!task) {
    return next({ status: 404, message: `Task with ID '${id}' not found.` });
  }
  return jsonResponse(res, 200, { success: true, data: task });
};

export const createTask = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body as Record<string, unknown>;
  const errors = validateTaskPayload(payload);
  if (errors.length > 0) {
    return next({ status: 400, message: 'Validation failed.', details: errors });
  }

  const task = createTaskItem(
    payload.title as string,
    payload.description as string,
    payload.priority as any,
    payload.status as any,
  );

  return jsonResponse(res, 201, { success: true, data: task });
};

export const updateTaskById = (req: Request, res: Response, next: NextFunction) => {
  const id = String(req.params.id);
  const payload = req.body as Record<string, unknown>;
  const errors = validateTaskPayload(payload);
  if (errors.length > 0) {
    return next({ status: 400, message: 'Validation failed.', details: errors });
  }

  const task = updateTask(id, {
    title: payload.title as string,
    description: payload.description as string,
    priority: payload.priority as any,
    status: payload.status as any,
  });

  if (!task) {
    return next({ status: 404, message: `Task with ID '${id}' not found.` });
  }

  return jsonResponse(res, 200, { success: true, data: task });
};

export const deleteTaskById = (req: Request, res: Response, next: NextFunction) => {
  const suppliedHeader = req.header(DELETE_AUTH_HEADER);
  if (suppliedHeader !== DELETE_AUTH_TOKEN) {
    return next({
      status: 403,
      message: 'Delete operation requires a valid authorization header.',
    });
  }

  const id = String(req.params.id);
  const removed = deleteTask(id);
  if (!removed) {
    return next({ status: 404, message: `Task with ID '${id}' not found.` });
  }
  return jsonResponse(res, 200, { success: true, data: { id } });
};
