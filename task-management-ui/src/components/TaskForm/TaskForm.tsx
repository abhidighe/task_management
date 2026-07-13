import './TaskForm.css'
import { useTaskForm } from './useTaskForm'
import type { Task } from '../../types'

interface TaskFormProps {
  taskToEdit: Task | null
  onSuccess: () => void
  onCancel: () => void
}

export default function TaskForm({ taskToEdit, onSuccess, onCancel }: TaskFormProps) {
  const { formData, editingId, saving, handleFormChange, handleSubmit } = useTaskForm(taskToEdit, onSuccess)
  return (
    <section className="task-form">
      <h2>{editingId ? 'Edit task' : 'Create task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Title
            <input
              value={formData.title}
              onChange={(event) => handleFormChange('title', event.target.value)}
              required
            />
          </label>
          <label>
            Priority
            <select
              value={formData.priority}
              onChange={(event) => handleFormChange('priority', event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea
            value={formData.description}
            onChange={(event) => handleFormChange('description', event.target.value)}
            rows={4}
            required
          />
        </label>

        <div className="form-row">
          <label>
            Status
            <select
              value={formData.status}
              onChange={(event) => handleFormChange('status', event.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="button" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
          </button>
          {editingId && (
            <button type="button" className="button secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
