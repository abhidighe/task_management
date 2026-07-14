import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TaskList from './TaskList'
import tasksReducer, { fetchTasks } from '../../slice/taskSlice'
import type { Task } from '../../types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: overrides.id ?? 'task-1',
    title: overrides.title ?? 'Write tests',
    description: overrides.description ?? 'Cover the UI behavior',
    priority: overrides.priority ?? 'high',
    status: overrides.status ?? 'todo',
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00.000Z',
  }
}

function renderWithStore(tasks: Task[] = []) {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  })

  store.dispatch({ type: fetchTasks.fulfilled.type, payload: tasks })

  render(
    <Provider store={store}>
      <TaskList onEdit={() => undefined} />
    </Provider>,
  )

  return store
}

describe('TaskList', () => {
  it('renders tasks and allows pagination controls to work', async () => {
    const user = userEvent.setup()
    const tasks = Array.from({ length: 10 }, (_, index) => makeTask({ id: `task-${index + 1}`, title: `Task ${index + 1}` }))
    renderWithStore(tasks)

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Showing 8 of 10 tasks')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Task 9')).toBeInTheDocument()
    expect(screen.getByText('Showing 2 of 10 tasks')).toBeInTheDocument()
  })

  it('shows a friendly empty state when there are no tasks', () => {
    renderWithStore([])

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument()
  })
})
