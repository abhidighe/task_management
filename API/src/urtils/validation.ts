import { allowedPriorities, allowedStatuses, TaskPriority, TaskStatus } from '../models/task';

export interface ValidationError {
  field: string;
  message: string;
}

export const isValidPriority = (value: unknown): value is TaskPriority =>
  typeof value === 'string' && allowedPriorities.includes(value as TaskPriority);

export const isValidStatus = (value: unknown): value is TaskStatus =>
  typeof value === 'string' && allowedStatuses.includes(value as TaskStatus);

export const validateTaskPayload = (
  payload: Record<string, unknown>,
  isPartial = false,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isPartial || payload.title !== undefined) {
    if (typeof payload.title !== 'string' || !payload.title.trim()) {
      errors.push({ field: 'title', message: 'Title is required and must be a non-empty string.' });
    }
  }

  if (!isPartial || payload.description !== undefined) {
    if (typeof payload.description !== 'string' || !payload.description.trim()) {
      errors.push({ field: 'description', message: 'Description is required and must be a non-empty string.' });
    }
  }

  if (!isPartial || payload.priority !== undefined) {
    if (!isValidPriority(payload.priority)) {
      errors.push({
        field: 'priority',
        message: `Priority is required and must be one of: ${allowedPriorities.join(', ')}.`,
      });
    }
  }

  if (!isPartial || payload.status !== undefined) {
    if (!isValidStatus(payload.status)) {
      errors.push({
        field: 'status',
        message: `Status is required and must be one of: ${allowedStatuses.join(', ')}.`,
      });
    }
  }

  return errors;
};
