import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TaskForm from './TaskForm'
import tasksReducer from '../../slice/taskSlice'
import type { Task } from '../../types'

function renderWithStore(taskToEdit: Task | null = null) {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  })

  render(
    <Provider store={store}>
      <TaskForm taskToEdit={taskToEdit} onSuccess={() => undefined} onCancel={() => undefined} />
    </Provider>,
  )

  return store
}

describe('TaskForm', () => {
  it('renders the create form by default and allows submission', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        success: true,
        data: {
          id: 'task-new',
          title: 'Ship feature',
          description: 'Write tests and ship it',
          priority: 'high',
          status: 'in-progress',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      }),
    )

    const store = renderWithStore()

    await user.type(screen.getByLabelText(/title/i), 'Ship feature')
    await user.type(screen.getByLabelText(/description/i), 'Write tests and ship it')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    await user.selectOptions(screen.getByLabelText(/status/i), 'in-progress')
    await user.click(screen.getByRole('button', { name: /create task/i }))

    await waitFor(() => {
      expect(store.getState().tasks.list).toHaveLength(1)
    })
    expect(store.getState().tasks.list[0].title).toBe('Ship feature')
  })

  it('shows an edit form when a task is passed in', () => {
    const task: Task = {
      id: 'task-1',
      title: 'Existing task',
      description: 'Already exists',
      priority: 'medium',
      status: 'done',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }

    renderWithStore(task)

    expect(screen.getByRole('heading', { name: /edit task/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument()
  })
})
