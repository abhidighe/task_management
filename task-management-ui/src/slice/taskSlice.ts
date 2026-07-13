import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Task } from '../types'
import { API_BASE, DELETE_AUTH_HEADER, DELETE_AUTH_TOKEN } from '../config/api'

type TaskFormState = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'done'
}

type StatusFilter = 'all' | 'todo' | 'in-progress' | 'done'

interface TasksState {
  list: Task[]
  loading: boolean
  saving: boolean
  deletingId: string | null
  error: string | null
  searchTask: string
  statusFilter: StatusFilter
}

const initialState: TasksState = {
  list: [],
  loading: false,
  saving: false,
  deletingId: null,
  error: null,
  searchTask: '',
  statusFilter: 'all',
}

const apiError = async (response: Response) => {
  try {
    const data = await response.json()
    return data.error?.message || data.message || response.statusText || 'API request failed'
  } catch {
    return response.statusText || 'API request failed'
  }
}

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, thunkApi) => {
    const response = await fetch(`${API_BASE}/tasks`)

    if (!response.ok) {
      const errorMessage = await apiError(response)
      return thunkApi.rejectWithValue(errorMessage)
    }

    const data = await response.json()
    if (!data.success) {
      return thunkApi.rejectWithValue(data.error?.message || 'Failed to load tasks')
    }

    return data.data as Task[]
  },
)

export const createTask = createAsyncThunk<Task, TaskFormState, { rejectValue: string }>(
  'tasks/createTask',
  async (task, thunkApi) => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    if (!response.ok) {
      const errorMessage = await apiError(response)
      return thunkApi.rejectWithValue(errorMessage)
    }

    const data = await response.json()
    if (!data.success) {
      return thunkApi.rejectWithValue(data.error?.message || 'Failed to create task')
    }

    return data.data as Task
  },
)

export const updateTask = createAsyncThunk<
  Task,
  { id: string; updates: TaskFormState },
  { rejectValue: string }
>(
  'tasks/updateTask',
  async ({ id, updates }, thunkApi) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorMessage = await apiError(response)
      return thunkApi.rejectWithValue(errorMessage)
    }

    const data = await response.json()
    if (!data.success) {
      return thunkApi.rejectWithValue(data.error?.message || 'Failed to update task')
    }

    return data.data as Task
  },
)

export const removeTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/removeTask',
  async (taskId, thunkApi) => {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        [DELETE_AUTH_HEADER]: DELETE_AUTH_TOKEN,
      },
    })

    if (!response.ok) {
      const errorMessage = await apiError(response)
      return thunkApi.rejectWithValue(errorMessage)
    }

    const data = await response.json()
    if (!data.success) {
      return thunkApi.rejectWithValue(data.error?.message || 'Failed to delete task')
    }

    return taskId
  },
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTask = action.payload
    },
    setStatusFilter(state, action: PayloadAction<StatusFilter>) {
      state.statusFilter = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load tasks'
      })
      .addCase(createTask.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.saving = false
        state.list.unshift(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to create task'
      })
      .addCase(updateTask.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.saving = false
        const index = state.list.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to update task'
      })
      .addCase(removeTask.pending, (state, action) => {
        state.deletingId = action.meta.arg
        state.error = null
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.deletingId = null
        state.list = state.list.filter((task) => task.id !== action.payload)
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.deletingId = null
        state.error = action.payload ?? 'Failed to delete task'
      })
  },
})

export const { setSearchTerm, setStatusFilter, clearError } = tasksSlice.actions
export default tasksSlice.reducer
