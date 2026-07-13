import { useState } from 'react'
import TaskTabs from '../Tabs/TaskTabs'
import TaskFilter from '../TaskFilter/TaskFilter'
import TaskForm from '../TaskForm/TaskForm'
import TaskList from '../TaskList/TaskList'
import './TaskDashboard.css'
import type { Task } from '../../types'
import { useTaskList } from '../TaskList/useTaskList'

export default function TaskDashboard() {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { taskCount } = useTaskList()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setActiveTab('form')
  }

  const handleSaveComplete = () => {
    setEditingTask(null)
    setActiveTab('list')
  }

  const handleCancel = () => {
    setEditingTask(null)
    setActiveTab('list')
  }

  return (
    <main className="dashboard">
      <div className="dashboard-shell">
          <div className="dashboard-title-group">
            <h1>Team Task Management</h1>
          </div>

        <div className="dashboard-tabs-row">
          <TaskTabs
            activeTab={activeTab}
            taskCount={taskCount}
            editing={Boolean(editingTask)}
            setActiveTab={setActiveTab}
          />
        </div>

        {activeTab === 'form' ? (
          <TaskForm taskToEdit={editingTask} onSuccess={handleSaveComplete} onCancel={handleCancel} />
        ) : (
          <>
            <TaskFilter />
            <TaskList onEdit={handleEdit} />
          </>
        )}
      </div>
    </main>
  )
}
