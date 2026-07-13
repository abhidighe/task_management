import { type Dispatch, type SetStateAction } from 'react'

type ActiveTab = 'list' | 'form'

export function useTaskTabs(
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>,
  editing: boolean,
) {
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
  }

  return {
    activeTab: editing ? 'form' : 'list',
    handleTabChange,
  }
}
