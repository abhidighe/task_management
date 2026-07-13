import { useEffect, useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearError, createTask, updateTask } from '../../slice/taskSlice'
import type { Task } from '../../types'

type TaskFormState = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'done'
}

const initialForm: TaskFormState = {
  title: '',
  description: '',
  priority: 'low',
  status: 'todo',
}

export function useTaskForm(taskToEdit: Task | null, onSuccess: () => void) {
  const dispatch = useAppDispatch()
  const saving = useAppSelector((state) => state.tasks.saving)
  const [formData, setFormData] = useState<TaskFormState>({ ...initialForm })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (taskToEdit) {
      setEditingId(taskToEdit.id)
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
      })
      return
    }

    setEditingId(null)
    setFormData({ ...initialForm })
  }, [taskToEdit])

  const resetForm = () => {
    setFormData({ ...initialForm })
    setEditingId(null)
    dispatch(clearError())
  }

  const handleFormChange = (field: keyof TaskFormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(clearError())

    const promise = editingId
      ? dispatch(updateTask({ id: editingId, updates: formData }))
      : dispatch(createTask(formData))

    void promise
      .unwrap()
      .then(() => {
        resetForm()
        onSuccess()
      })
  }

  return {
    formData,
    editingId,
    saving,
    resetForm,
    handleFormChange,
    handleSubmit,
  }
}
