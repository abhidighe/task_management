import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { removeTask } from '../../slice/taskSlice'

export function useTaskList() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.list)
  const deletingId = useAppSelector((state) => state.tasks.deletingId)
  const searchTask = useAppSelector((state) => state.tasks.searchTask)
  const statusFilter = useAppSelector((state) => state.tasks.statusFilter)
  const loading = useAppSelector((state) => state.tasks.loading)
  const error = useAppSelector((state) => state.tasks.error)

  const filteredTasks = useMemo(() => {
    const taskSearch = searchTask
      ? tasks.filter((task) => task.title.toLowerCase().includes(searchTask))
      : tasks

    if (statusFilter === 'all') {
      return taskSearch;
    }

    return taskSearch.filter((task) => task.status === statusFilter)
  }, [tasks, searchTask, statusFilter])

  const handleDelete = (taskId: string) => {
    if (!window.confirm('Delete this task?')) {
      return
    }

    void dispatch(removeTask(taskId));
  }

  return {
    tasks: filteredTasks,
    taskCount: tasks.length,
    deletingId,
    handleDelete,
    loading,
    error,
  }
}
