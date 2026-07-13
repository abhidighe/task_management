import type { Dispatch, SetStateAction } from 'react'
import './TaskTabs.css'

interface TaskTabsProps {
  activeTab: 'list' | 'form'
  taskCount: number
  editing: boolean
  setActiveTab: Dispatch<SetStateAction<'list' | 'form'>>
}

export default function TaskTabs({ activeTab, taskCount, editing, setActiveTab }: TaskTabsProps) {
  return (
    <div className="tab-row">
      <button
        type="button"
        className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => setActiveTab('list')}
      >
        Tasks ({taskCount})
      </button>
      <button
        type="button"
        className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
        onClick={() => setActiveTab('form')}
      >
        {editing ? 'Edit Task' : 'Create Task'}
      </button>
    </div>
  )
}
