import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export interface NavItemConfig {
  to: string
  label: string
  icon: React.ReactNode
  badge?: number | string
  roles: string[]
}

interface SidebarNavItemProps {
  item: NavItemConfig
  isCollapsed: boolean
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ item, isCollapsed }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          `flex items-center rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
            isCollapsed
              ? 'justify-center p-3'
              : 'justify-between px-3.5 py-2.5'
          } ${
            isActive
              ? 'bg-[#ebf5ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] font-bold shadow-xs'
              : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] hover:text-[#0866ff] dark:hover:text-[#2d88ff]'
          }`
        }
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 transition-transform group-hover:scale-105 duration-150">
            {item.icon}
          </span>
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </div>

        {/* Badge when expanded */}
        {!isCollapsed && item.badge !== undefined && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fa383e] text-white shadow-xs">
            {item.badge}
          </span>
        )}

        {/* Mini dot / badge when collapsed */}
        {isCollapsed && item.badge !== undefined && (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fa383e] text-white min-w-[16px] text-center shadow-xs">
            {item.badge}
          </span>
        )}
      </NavLink>

      {/* Floating Tooltip for collapsed state */}
      {isCollapsed && isHovered && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#050505] dark:bg-[#242526] text-white text-xs font-semibold rounded-xl shadow-xl z-50 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2 border border-[#393a3b]">
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#fa383e] text-[10px] font-bold">
              {item.badge}
            </span>
          )}
          {/* Arrow */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#050505] dark:bg-[#242526] border-l border-b border-[#393a3b] rotate-45" />
        </div>
      )}
    </div>
  )
}

export default SidebarNavItem
