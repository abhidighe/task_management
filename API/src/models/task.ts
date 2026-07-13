export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export const allowedPriorities: TaskPriority[] = ['low', 'medium', 'high'];
export const allowedStatuses: TaskStatus[] = ['todo', 'in-progress', 'done'];
