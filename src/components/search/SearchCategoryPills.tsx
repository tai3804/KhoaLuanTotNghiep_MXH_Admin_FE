import React from 'react'
import { Users, FileText, ShieldAlert, Users2, Layers } from 'lucide-react'

export type SearchCategoryType = 'ALL' | 'USERS' | 'POSTS' | 'REPORTS' | 'GROUPS'

interface SearchCategoryPillsProps {
  activeCategory: SearchCategoryType
  onSelectCategory: (cat: SearchCategoryType) => void
  counts: {
    all: number
    users: number
    posts: number
    reports: number
    groups: number
  }
}

export const SearchCategoryPills: React.FC<SearchCategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const tabs: {
    key: SearchCategoryType
    label: string
    icon: React.ReactNode
    count: number
    activeBg: string
    activeText: string
  }[] = [
    {
      key: 'ALL',
      label: 'Tất cả mục',
      icon: <Layers className="w-4 h-4" />,
      count: counts.all,
      activeBg: 'bg-[#1877f2]',
      activeText: 'text-white',
    },
    {
      key: 'USERS',
      label: 'Người dùng',
      icon: <Users className="w-4 h-4" />,
      count: counts.users,
      activeBg: 'bg-indigo-600',
      activeText: 'text-white',
    },
    {
      key: 'POSTS',
      label: 'Bài viết',
      icon: <FileText className="w-4 h-4" />,
      count: counts.posts,
      activeBg: 'bg-emerald-600',
      activeText: 'text-white',
    },
    {
      key: 'REPORTS',
      label: 'Báo cáo vi phạm',
      icon: <ShieldAlert className="w-4 h-4" />,
      count: counts.reports,
      activeBg: 'bg-rose-600',
      activeText: 'text-white',
    },
    {
      key: 'GROUPS',
      label: 'Hội nhóm',
      icon: <Users2 className="w-4 h-4" />,
      count: counts.groups,
      activeBg: 'bg-cyan-600',
      activeText: 'text-white',
    },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onSelectCategory(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? `${tab.activeBg} ${tab.activeText} shadow-sm shadow-${tab.activeBg}/20`
                : 'bg-white dark:bg-[#242526] text-slate-600 dark:text-[#b0b3b8] border border-slate-200 dark:border-[#393a3b] hover:bg-slate-50 dark:hover:bg-[#3a3b3c] hover:text-slate-900 dark:hover:text-[#e4e6eb]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-[#3a3b3c] text-slate-600 dark:text-[#b0b3b8]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default SearchCategoryPills
