import React from 'react'
import SidebarNavItem, { NavItemConfig } from './SidebarNavItem'

interface SidebarNavListProps {
  items: NavItemConfig[]
  isCollapsed: boolean
  isModerator: boolean
}

export const SidebarNavList: React.FC<SidebarNavListProps> = ({
  items,
  isCollapsed,
  isModerator,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
      {!isCollapsed && (
        <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
          {isModerator ? 'Kiểm duyệt nội dung' : 'Quản trị hệ thống'}
        </p>
      )}

      {items.map((item) => (
        <SidebarNavItem
          key={item.to}
          item={item}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  )
}

export default SidebarNavList
