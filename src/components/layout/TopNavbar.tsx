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
import { logout, updateUser } from '../../store/slices/authSlice'
import { authService } from '../../services/authService'
import {
  isSoundEnabled,
  setSoundEnabled,
  playEmergencyReportSound,
  playNotificationSound,
} from '../../utils/soundAlert'
import Badge from '../common/Badge'
import Avatar from '../common/Avatar'
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

  // Fetch fresh profile with avatarUrl for the logged-in admin if missing
  useEffect(() => {
    if (user?.id && !user.avatarUrl) {
      authService
        .getCurrentUser()
        .then((profile) => {
          if (profile) {
            dispatch(updateUser(profile))
          }
        })
        .catch(() => {})
    }
  }, [user?.id, user?.avatarUrl, dispatch])

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
    <header className="h-16 bg-white dark:bg-[#242526] border-b border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between px-6 shrink-0 z-30 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      {/* Left Section: Search Bar in Meta Pill Style */}
      <div className="flex items-center">
        <div className="relative w-72 md:w-96">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-[#65676b] dark:text-[#b0b3b8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              placeholder="Tìm kiếm trên Facebook Admin..."
              className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c] hover:bg-[#e4e6eb] dark:hover:bg-[#4e4f50] text-sm text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-[#0866ff] focus:bg-white dark:focus:bg-[#3a3b3c] focus:outline-none transition-all shadow-xs"
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

      {/* Right Controls in Circular Facebook Header Style */}
      <div className="flex items-center gap-2.5">
        {/* Reload Button */}
        <button
          onClick={handleReload}
          disabled={isReloading}
          className="w-10 h-10 rounded-full bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] flex items-center justify-center transition-colors disabled:opacity-60 cursor-pointer"
          title="Tải lại trang (Reload)"
        >
          <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
        </button>

        {/* Sound Alert Toggle */}
        <button
          onClick={toggleSound}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            soundActive
              ? 'bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
              : 'bg-[#fff8e1] dark:bg-[#f5c33b]/20 text-[#b78103] dark:text-[#f5c33b]'
          }`}
          title={soundActive ? 'Âm thanh thông báo: Đang bật (Click để tắt)' : 'Âm thanh thông báo: Đang tắt (Click để bật)'}
        >
          {soundActive ? (
            <Volume2 className="w-4 h-4 text-[#31a24c]" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-10 h-10 rounded-full bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] flex items-center justify-center transition-colors cursor-pointer"
          title={isDark ? 'Chuyển sang chế độ Sáng (Light)' : 'Chuyển sang chế độ Tối (Dark)'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#f5c33b]" />
          ) : (
            <Moon className="w-4 h-4 text-[#65676b]" />
          )}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isNotificationOpen
                ? 'bg-[#0866ff] text-white'
                : 'bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
            }`}
            title="Xem thông báo quản trị"
          >
            <Bell className="w-4 h-4" />
          </button>
          {effectiveUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#fa383e] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse pointer-events-none">
              {effectiveUnreadCount > 99 ? '99+' : effectiveUnreadCount}
            </span>
          )}

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            onUpdateUnreadCount={(count) => setUnreadCount(count)}
          />
        </div>

        {/* Current Logged-in Admin Profile snippet */}
        <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b]">
          <Avatar
            src={user?.avatarUrl}
            name={user?.fullName || 'Admin'}
            size="sm"
            shape="rounded"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] max-w-[120px] truncate leading-tight">
              {user?.fullName || 'Admin'}
            </span>
            <span className="text-[10px] font-bold text-[#0866ff] dark:text-[#2d88ff] uppercase tracking-wider mt-0.5">
              {user?.role === 'MODERATOR' || (user?.roles && user.roles.includes('ROLE_MODERATOR') && !user.roles.includes('ROLE_ADMIN'))
                ? 'MODERATOR'
                : user?.role || 'ADMIN'}
            </span>
          </div>
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-[#ffebe8] hover:bg-[#fed2cd] dark:bg-[#fa383e]/20 dark:hover:bg-[#fa383e]/30 text-[#fa383e] flex items-center justify-center transition-colors cursor-pointer ml-1"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

export default TopNavbar
