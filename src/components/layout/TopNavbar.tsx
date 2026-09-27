import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Bell,
  Search,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleTheme } from '../../store/slices/themeSlice'
import { logout } from '../../store/slices/authSlice'
import { authService } from '../../services/authService'
import {
  isSoundEnabled,
  setSoundEnabled,
  playEmergencyReportSound,
  playNotificationSound,
} from '../../utils/soundAlert'
import Badge from '../common/Badge'
import NotificationDropdown from './NotificationDropdown'
import SearchAutocompleteDropdown from '../search/SearchAutocompleteDropdown'
import notificationService from '../../services/notificationService'
import { userService } from '../../services/userService'
import { postService } from '../../services/postService'
import { reportService } from '../../services/reportService'
import { groupService } from '../../services/groupService'
import { setUsers } from '../../store/slices/userSlice'
import { setPosts } from '../../store/slices/postSlice'
import { setReports } from '../../store/slices/reportSlice'
import { setGroups } from '../../store/slices/groupSlice'
import { addSearchHistory } from '../../utils/searchHistory'

export const TopNavbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)
  const pendingReportsCount = useAppSelector(
    (state) => state.dashboard.stats?.pendingReports ?? 0
  )
  const [isReloading, setIsReloading] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [topSearchQuery, setTopSearchQuery] = useState('')
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [unreadCount, setUnreadCount] = useState<number | null>(null)
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled())
  const prevReportsRef = useRef<number>(pendingReportsCount)

  const usersCount = useAppSelector((state) => state.user.users.length)

  // Global Ctrl + K / Cmd + K keyboard shortcut focuses the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setIsSearchDropdownOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearchDropdownOpen(false)
    const q = topSearchQuery.trim()
    if (q) {
      addSearchHistory(q)
      navigate(`/search?q=${encodeURIComponent(q)}`)
    } else {
      navigate('/search')
    }
  }

  const handleSelectSuggestion = (keyword: string, catParam?: string) => {
    setTopSearchQuery(keyword)
    setIsSearchDropdownOpen(false)
    addSearchHistory(keyword)
    if (catParam && catParam !== 'ALL') {
      navigate(`/search?q=${encodeURIComponent(keyword)}&cat=${catParam}`)
    } else {
      navigate(`/search?q=${encodeURIComponent(keyword)}`)
    }
  }

  useEffect(() => {
    notificationService.getUnreadCount().then((count) => {
      setUnreadCount(count)
    })
  }, [])

  // Audio alert if new pending reports arrive
  useEffect(() => {
    if (pendingReportsCount > prevReportsRef.current && prevReportsRef.current > 0) {
      playEmergencyReportSound()
    }
    prevReportsRef.current = pendingReportsCount
  }, [pendingReportsCount])

  const toggleSound = () => {
    const nextState = !soundActive
    setSoundActive(nextState)
    setSoundEnabled(nextState)
    if (nextState) {
      playNotificationSound()
    }
  }

  const effectiveUnreadCount = unreadCount !== null ? unreadCount : pendingReportsCount

  const handleReload = useCallback(() => {
    setIsReloading(true)
    setTimeout(() => {
      window.location.reload()
    }, 400)
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.warn('Logout warning:', err)
    } finally {
      dispatch(logout())
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="h-16 bg-white/90 dark:bg-[#242526]/90 backdrop-blur-md border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between px-6 shrink-0 z-30 transition-colors">
      {/* Left Section: Search Bar with Autocomplete & History */}
      <div className="flex items-center">
        {/* Global Search Input Form */}
        <div className="relative w-72 md:w-96">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full"
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-[#b0b3b8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={topSearchQuery}
              onFocus={() => {
                setIsSearchDropdownOpen(true)
                if (usersCount === 0) {
                  userService.getAllUsers().then((d) => dispatch(setUsers({ users: d }))).catch(() => {})
                  postService.getAllPosts().then((d) => dispatch(setPosts({ posts: d }))).catch(() => {})
                  reportService.getAllReports().then((d) => dispatch(setReports(d))).catch(() => {})
                  groupService.getAllGroups().then((d) => dispatch(setGroups(d))).catch(() => {})
                }
              }}
              onChange={(e) => {
                setTopSearchQuery(e.target.value)
                setIsSearchDropdownOpen(true)
              }}
              placeholder="Tìm kiếm người dùng, bài viết, báo cáo..."
              className="w-full bg-slate-100 dark:bg-[#3a3b3c]/60 text-xs text-slate-900 dark:text-[#e4e6eb] placeholder:text-slate-400 dark:placeholder:text-[#b0b3b8] pl-9.5 pr-4 py-2 rounded-xl border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#1877f2] dark:focus:border-[#1877f2] focus:bg-white dark:focus:bg-[#3a3b3c] focus:outline-hidden transition-all shadow-2xs"
            />
          </form>

          {/* Live Autocomplete Suggestions Dropdown */}
          <SearchAutocompleteDropdown
            query={topSearchQuery}
            isOpen={isSearchDropdownOpen}
            onSelect={handleSelectSuggestion}
            onClose={() => setIsSearchDropdownOpen(false)}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Reload Button */}
        <button
          onClick={handleReload}
          disabled={isReloading}
          className="p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] hover:text-[#1877f2] dark:hover:text-[#2d88ff] transition-colors disabled:opacity-60"
          title="Tải lại trang (Reload)"
        >
          <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
        </button>

        {/* Sound Alert Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2.5 rounded-xl border transition-colors ${
            soundActive
              ? 'border-[#e4e6eb] dark:border-[#393a3b] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
              : 'border-amber-200 dark:border-amber-900/40 text-amber-500 bg-amber-50/50 dark:bg-amber-500/10'
          }`}
          title={soundActive ? 'Âm thanh thông báo: Đang bật (Click để tắt)' : 'Âm thanh thông báo: Đang tắt (Click để bật)'}
        >
          {soundActive ? (
            <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
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

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isNotificationOpen
                ? 'border-[#1877f2] bg-[#1877f2]/10 text-[#1877f2]'
                : 'border-[#e4e6eb] dark:border-[#393a3b] text-slate-600 dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
            }`}
            title="Xem thông báo quản trị"
          >
            <Bell className="w-4 h-4" />
          </button>
          {effectiveUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
              {effectiveUnreadCount > 99 ? '99+' : effectiveUnreadCount}
            </span>
          )}

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            onUpdateUnreadCount={(count) => setUnreadCount(count)}
          />
        </div>

        {/* Current Role Badge */}
        <Badge
          variant={
            user?.role === 'MODERATOR' || (user?.roles && user.roles.includes('ROLE_MODERATOR') && !user.roles.includes('ROLE_ADMIN'))
              ? 'warning'
              : 'primary'
          }
          size="md"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          {user?.role === 'MODERATOR' || (user?.roles && user.roles.includes('ROLE_MODERATOR') && !user.roles.includes('ROLE_ADMIN'))
            ? 'MODERATOR'
            : user?.role || 'ADMIN'}
        </Badge>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

export default TopNavbar
