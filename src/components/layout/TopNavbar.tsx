import React, { useState, useCallback } from 'react'
import {
  Sun,
  Moon,
  Bell,
  Search,
  ShieldCheck,
  Menu,
  RefreshCw,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleTheme, toggleSidebar } from '../../store/slices/themeSlice'
import Badge from '../common/Badge'

export const TopNavbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)
  const pendingReportsCount = useAppSelector(
    (state) => state.dashboard.stats?.pendingReports ?? 0
  )
  const [isReloading, setIsReloading] = useState(false)

  const handleReload = useCallback(() => {
    setIsReloading(true)
    setTimeout(() => {
      window.location.reload()
    }, 400)
  }, [])

  return (
    <header className="h-16 bg-white/90 dark:bg-[#242526]/90 backdrop-blur-md border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between px-6 shrink-0 z-30 transition-colors">
      {/* Left Section: Sidebar Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl text-slate-500 dark:text-[#b0b3b8] hover:text-slate-900 dark:hover:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
          title="Đóng / Mở thanh điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#b0b3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm nhanh người dùng, bài viết, báo cáo..."
            className="w-full bg-slate-100 dark:bg-[#3a3b3c]/60 text-xs text-slate-900 dark:text-[#e4e6eb] pl-9 pr-4 py-2 rounded-xl outline-none border border-transparent focus:border-[#1877f2]/50 focus:bg-white dark:focus:bg-[#3a3b3c] transition-all placeholder:text-slate-400 dark:placeholder:text-[#b0b3b8]"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Admin API :8090</span>
        </div>

        {/* Reload Button */}
        <button
          onClick={handleReload}
          disabled={isReloading}
          className="p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] hover:text-[#1877f2] dark:hover:text-[#2d88ff] transition-colors disabled:opacity-60"
          title="Tải lại trang (Reload)"
        >
          <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
          title={isDark ? 'Chuyển sang chế độ Sáng (Light)' : 'Chuyển sang chế độ Tối (Dark)'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          {pendingReportsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {pendingReportsCount}
            </span>
          )}
        </div>

        {/* Current Role Badge */}
        <Badge variant="primary" size="md">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          {user?.role || 'ADMIN'}
        </Badge>
      </div>
    </header>
  )
}

export default TopNavbar
