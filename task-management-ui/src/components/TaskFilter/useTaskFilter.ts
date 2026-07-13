import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setSearchTerm, setStatusFilter } from '../../slice/taskSlice'

type StatusFilter = 'all' | 'todo' | 'in-progress' | 'done'

export function useTaskFilter() {
  const dispatch = useAppDispatch()
  const searchTask = useAppSelector((state) => state.tasks.searchTask)
  const statusFilter = useAppSelector((state) => state.tasks.statusFilter)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTask)

  useEffect(() => {
    setLocalSearchTerm(searchTask)
  }, [searchTask])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      dispatch(setSearchTerm(localSearchTerm.trim().toLowerCase()))
    }, 180)

    return () => window.clearTimeout(timeout)
  }, [dispatch, localSearchTerm])

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value)
  }

  const handleStatusChange = (value: StatusFilter) => {
    dispatch(setStatusFilter(value))
  }

  return {
    localSearchTerm,
    statusFilter,
    handleSearchChange,
    handleStatusChange,
  }
}
