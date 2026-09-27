import React from 'react'
import { PanelLeftClose } from 'lucide-react'
import Logo from '../../common/Logo'

interface SidebarBrandHeaderProps {
  isCollapsed: boolean
  isModerator: boolean
  onToggle: () => void
}

export const SidebarBrandHeader: React.FC<SidebarBrandHeaderProps> = ({
  isCollapsed,
  isModerator,
  onToggle,
}) => {
  return (
    <div
      className={`h-16 flex items-center border-b border-[#e4e6eb] dark:border-[#393a3b] transition-all duration-300 px-3.5 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Brand Icon matching User FE */}
        <Logo
          size="md"
          onClick={isCollapsed ? onToggle : undefined}
          className={isCollapsed ? 'cursor-pointer' : ''}
        />

        {/* Brand Title & Subtitle */}
        {!isCollapsed && (
          <div className="min-w-0 truncate animate-in fade-in duration-200">
            <h1 className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb] tracking-tight">
              {isModerator ? 'KLTN Moderator' : 'KLTN Admin'}
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-[#b0b3b8] font-medium truncate">
              {isModerator ? 'Content Portal' : 'Social Portal'}
            </p>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      {!isCollapsed && (
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
          title="Thu gọn thanh điều hướng"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SidebarBrandHeader
