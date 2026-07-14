import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TaskFilter from './TaskFilter'
import tasksReducer from '../../slice/taskSlice'

function renderWithStore() {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  })

  render(
    <Provider store={store}>
      <TaskFilter />
    </Provider>,
  )

  return store
}

describe('TaskFilter', () => {
  it('updates the search term and status filter through the UI', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    await user.type(searchInput, 'alpha')

    await waitFor(() => expect(store.getState().tasks.searchTask).toBe('alpha'))

    const statusSelect = screen.getByLabelText(/status filter/i)
    await user.selectOptions(statusSelect, 'done')

    expect(store.getState().tasks.statusFilter).toBe('done')
  })

  it('keeps the raw search input value while syncing the store state', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    await user.type(searchInput, '  Alpha  ')

    await waitFor(() => expect(store.getState().tasks.searchTask).toBe('alpha'))
    expect(searchInput).toHaveValue('alpha')
  })
})
