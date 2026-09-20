import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  Users2,
  BookX,
  History,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/themeSlice'
import { authService } from '../../services/authService'
import { Avatar } from '../common/Avatar'

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const isCollapsed = useAppSelector((state) => state.theme.isSidebarCollapsed)
  const pendingReportsCount = useAppSelector(
    (state) => state.dashboard.stats?.pendingReports ?? 0
  )

  const handleLogout = async () => {
    await authService.logout()
    dispatch(logout())
    navigate('/login')
  }

  const navItems = [
    {
      to: '/',
      label: 'Tổng quan (Dashboard)',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      to: '/users',
      label: 'Quản lý Người dùng',
      icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      to: '/posts',
      label: 'Quản lý Bài viết',
      icon: <FileText className="w-5 h-5 shrink-0" />,
    },
    {
      to: '/reports',
      label: 'Kiểm duyệt Báo cáo',
      icon: <ShieldAlert className="w-5 h-5 shrink-0" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
    },
    {
      to: '/groups',
      label: 'Quản lý Hội nhóm',
      icon: <Users2 className="w-5 h-5 shrink-0" />,
    },
    {
      to: '/blacklist',
      label: 'Từ điển từ cấm',
      icon: <BookX className="w-5 h-5 shrink-0" />,
    },
    {
      to: '/audit-logs',
      label: 'Nhật ký & Giám sát',
      icon: <History className="w-5 h-5 shrink-0" />,
    },
  ]

  return (
    <aside
      className={`h-screen bg-white dark:bg-[#242526] border-r border-[#e4e6eb] dark:border-[#393a3b] flex flex-col shrink-0 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header & Collapse Toggle */}
      <div
        className={`h-16 flex items-center border-b border-[#e4e6eb] dark:border-[#393a3b] px-4 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#1877f2] to-violet-600 flex items-center justify-center text-white shadow-md shadow-[#1877f2]/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 truncate">
              <h1 className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb] tracking-tight">
                KLTN Admin
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-[#b0b3b8] font-medium truncate">
                Social Portal
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
            title="Thu gọn thanh điều hướng"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
            Quản trị hệ thống
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-xl text-xs font-semibold transition-all group relative ${
                isCollapsed
                  ? 'justify-center p-3'
                  : 'justify-between px-3.5 py-2.5'
              } ${
                isActive
                  ? 'bg-[#1877f2]/10 text-[#1877f2] dark:bg-[#1877f2]/20 dark:text-[#2d88ff] font-bold'
                  : 'text-slate-600 dark:text-[#b0b3b8] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] hover:text-slate-900 dark:hover:text-[#e4e6eb]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </div>

            {item.badge !== undefined && (
              <span
                className={`font-bold bg-rose-500 text-white shadow-xs ${
                  isCollapsed
                    ? 'absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] min-w-[16px] text-center'
                    : 'px-2 py-0.5 rounded-full text-[10px]'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-3 border-t border-[#e4e6eb] dark:border-[#393a3b]">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-[#18191a]/50 mb-2 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? (user?.fullName || 'Admin User') : undefined}
        >
          <Avatar
            src={user?.avatarUrl}
            name={user?.fullName || 'Admin'}
            size={isCollapsed ? 'sm' : 'md'}
            shape="rounded"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-[#e4e6eb] truncate">
                {user?.fullName || 'Admin User'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-[#b0b3b8] truncate">
                {user?.role || 'ROLE_ADMIN'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          title="Đăng xuất khỏi hệ thống"
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ${
            isCollapsed ? 'px-2' : 'px-3'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>

        {isCollapsed && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="mt-2 w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
            title="Mở rộng thanh điều hướng"
          >
            <PanelLeftOpen className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
