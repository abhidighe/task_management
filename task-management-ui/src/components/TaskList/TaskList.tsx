import { useMemo, useState } from 'react'
import type { Task } from '../../types'
import './TaskList.css'
import { useTaskList } from './useTaskList'

interface TaskListProps {
  onEdit: (task: Task) => void
}

const PAGE_SIZE = 8

export default function TaskList({ onEdit }: TaskListProps) {
  const { tasks, deletingId, handleDelete, loading, error } = useTaskList()
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))

  const pagedTasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return tasks.slice(start, start + PAGE_SIZE)
  }, [tasks, page])

  const handlePrevious = () => setPage((current) => Math.max(1, current - 1))
  const handleNext = () => setPage((current) => Math.min(pageCount, current + 1))

  if (loading) {
    return <div className="status">Loading tasks...</div>
  }

  if (error) {
    return <div className="status error">{error}</div>
  }

  if (tasks.length === 0) {
    return <div className="status">No tasks found.</div>
  }

  return (
    <section className="task-table-wrapper">
      <section className="task-table">
        <div className="task-table-header">
          <div className="task-header-cell title-cell">Title / Description</div>
          <div className="task-header-cell">Priority</div>
          <div className="task-header-cell">Status</div>
          <div className="task-header-cell updated-cell">Updated</div>
          <div className="task-header-cell actions-cell">Actions</div>
        </div>
        {pagedTasks.map((task) => (
          <div className="task-row" key={task.id}>
            <div className="task-cell title-cell">
              <div className="task-title">{task.title}</div>
              <div className="task-description">{task.description}</div>
            </div>
            <div className="task-cell">
              <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
            </div>
            <div className="task-cell status-cell">
              <span className={`status-pill ${task.status}`}>{task.status}</span>
            </div>
            <div className="task-cell updated-cell">{new Date(task.updatedAt).toLocaleString()}</div>
            <div className="task-cell actions-cell">
              <button type="button" className="button edit" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button
                type="button"
                className="button delete"
                onClick={() => handleDelete(task.id)}
                disabled={deletingId === task.id}
              >
                {deletingId === task.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </section>
      <div className="table-summary-row">
        <div>{`Showing ${pagedTasks.length} of ${tasks.length} tasks`}</div>
        <div className="pagination-controls">
          <button type="button" className="button secondary" onClick={handlePrevious} disabled={page === 1}>
            Previous
          </button>
          <span className="page-info">
            Page {page} of {pageCount}
          </span>
          <button type="button" className="button secondary" onClick={handleNext} disabled={page === pageCount}>
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
