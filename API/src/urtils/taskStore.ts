import { Task, TaskPriority, TaskStatus } from '../models/task';

const tasks: Task[] = [];

const makeId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const now = (): string => new Date().toISOString();

export const getAllTasks = (): Task[] => [...tasks];

export const findTaskById = (id: string): Task | undefined => tasks.find((task) => task.id === id);

export const createTaskItem = (
  title: string,
  description: string,
  priority: TaskPriority,
  status: TaskStatus,
): Task => {
  const task: Task = {
    id: makeId(),
    title,
    description,
    priority,
    status,
    createdAt: now(),
    updatedAt: now(),
  };

  tasks.push(task);
  return task;
};

export const updateTask = (
  id: string,
  payload: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status'>>,
): Task | undefined => {
  const task = findTaskById(id);
  if (!task) return undefined;

  if (payload.title !== undefined) task.title = payload.title;
  if (payload.description !== undefined) task.description = payload.description;
  if (payload.priority !== undefined) task.priority = payload.priority;
  if (payload.status !== undefined) task.status = payload.status;
  task.updatedAt = now();
  return task;
};

export const deleteTask = (id: string): boolean => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};

export const seedTasks = (newTasks: Task[]): void => {
  tasks.length = 0;
  tasks.push(...newTasks);
};
