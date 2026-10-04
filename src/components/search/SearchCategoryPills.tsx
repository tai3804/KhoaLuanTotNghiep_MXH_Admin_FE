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
  }[] = [
    {
      key: 'ALL',
      label: 'Tất cả mục',
      icon: <Layers className="w-4 h-4" />,
      count: counts.all,
    },
    {
      key: 'USERS',
      label: 'Người dùng',
      icon: <Users className="w-4 h-4" />,
      count: counts.users,
    },
    {
      key: 'POSTS',
      label: 'Bài viết',
      icon: <FileText className="w-4 h-4" />,
      count: counts.posts,
    },
    {
      key: 'REPORTS',
      label: 'Báo cáo vi phạm',
      icon: <ShieldAlert className="w-4 h-4" />,
      count: counts.reports,
    },
    {
      key: 'GROUPS',
      label: 'Hội nhóm',
      icon: <Users2 className="w-4 h-4" />,
      count: counts.groups,
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
                ? 'bg-[#0866FF] text-white shadow-xs'
                : 'bg-white dark:bg-[#242526] text-[#65676B] dark:text-[#B0B3B8] border border-[#E4E6EB] dark:border-[#393A3B] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] hover:text-[#050505] dark:hover:text-[#E4E6EB]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]'
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

