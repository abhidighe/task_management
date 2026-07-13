import './TaskFilter.css'
import { useTaskFilter } from './useTaskFilter'

export default function TaskFilter() {
  const { localSearchTerm, statusFilter, handleSearchChange, handleStatusChange } = useTaskFilter()
  return (
    <section className="filter-bar">
      <div className="filter-row">
        <label>
          Search
          <input
            type="search"
            placeholder="Search tasks..."
            value={localSearchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </label>
        <label>
          Status filter
          <select value={statusFilter} onChange={(event) => handleStatusChange(event.target.value as any)}>
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
    </section>
  )
}
