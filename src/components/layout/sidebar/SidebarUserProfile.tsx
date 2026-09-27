import React from 'react'
import { LogOut, PanelLeftOpen } from 'lucide-react'
import Avatar from '../../common/Avatar'

interface SidebarUserProfileProps {
  user: any
  isCollapsed: boolean
  onLogout: () => void
  onToggleExpand: () => void
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
  isCollapsed,
  onLogout,
  onToggleExpand,
}) => {
  return (
    <div className="p-3 border-t border-[#e4e6eb] dark:border-[#393a3b] transition-all duration-300">
      {/* User Info Card */}
      <div
        className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-[#18191a]/50 mb-2 transition-all ${
          isCollapsed ? 'justify-center' : ''
        }`}
        title={isCollapsed ? (user?.fullName || 'Tài khoản Quản trị') : undefined}
      >
        <Avatar
          src={user?.avatarUrl}
          name={user?.fullName || 'Admin'}
          size={isCollapsed ? 'sm' : 'md'}
          shape="rounded"
        />
        {!isCollapsed && (
          <div className="flex-1 min-w-0 truncate">
            <p className="text-xs font-bold text-slate-900 dark:text-[#e4e6eb] truncate">
              {user?.fullName || 'Tài khoản Quản trị'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-[#b0b3b8] truncate">
              {user?.role || 'ROLE_ADMIN'}
            </p>
          </div>
        )}
      </div>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        title="Đăng xuất khỏi hệ thống"
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer ${
          isCollapsed ? 'px-2' : 'px-3'
        }`}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!isCollapsed && <span>Đăng xuất</span>}
      </button>

      {/* Expand trigger when collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggleExpand}
          className="mt-2 w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
          title="Mở rộng thanh điều hướng"
        >
          <PanelLeftOpen className="w-4 h-4 shrink-0" />
        </button>
      )}
    </div>
  )
}

export default SidebarUserProfile
