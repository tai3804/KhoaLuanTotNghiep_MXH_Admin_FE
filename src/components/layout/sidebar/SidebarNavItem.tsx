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
              ? 'bg-[#1877f2]/10 text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-bold shadow-2xs'
              : 'text-slate-600 dark:text-[#b0b3b8] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] hover:text-slate-900 dark:hover:text-[#e4e6eb]'
          }`
        }
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 transition-transform group-hover:scale-110 duration-150">
            {item.icon}
          </span>
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </div>

        {/* Badge when expanded */}
        {!isCollapsed && item.badge !== undefined && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
            {item.badge}
          </span>
        )}

        {/* Mini dot / badge when collapsed */}
        {isCollapsed && item.badge !== undefined && (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white min-w-[16px] text-center shadow-xs">
            {item.badge}
          </span>
        )}
      </NavLink>

      {/* Floating Tooltip for collapsed state */}
      {isCollapsed && isHovered && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xl z-50 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2 border border-slate-700">
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] font-bold">
              {item.badge}
            </span>
          )}
          {/* Arrow */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-l border-b border-slate-700 rotate-45" />
        </div>
      )}
    </div>
  )
}

export default SidebarNavItem
