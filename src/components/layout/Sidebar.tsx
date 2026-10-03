import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Users,
  FileText,
  ShieldAlert,
  Users2,
  BookX,
  History,
  Sliders,
  Cpu,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/themeSlice'
import { authService } from '../../services/authService'

import SidebarBrandHeader from './sidebar/SidebarBrandHeader'
import SidebarNavList from './sidebar/SidebarNavList'
import SidebarUserProfile from './sidebar/SidebarUserProfile'
import { NavItemConfig } from './sidebar/SidebarNavItem'

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const isCollapsed = useAppSelector((state) => state.theme.isSidebarCollapsed)
  const pendingReportsCount = useAppSelector(
    (state) => state.dashboard.stats?.pendingReports ?? 0
  )

  const isModerator = Boolean(
    user?.role === 'MODERATOR' ||
    (user?.roles && user.roles.includes('ROLE_MODERATOR') && !user.roles.includes('ROLE_ADMIN'))
  )

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.warn('Logout error handled:', err)
    } finally {
      dispatch(logout())
      navigate('/login', { replace: true })
    }
  }

  const navItems: NavItemConfig[] = useMemo(
    () => [
      {
        to: '/',
        label: 'Tổng quan (Dashboard)',
        icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/analytics',
        label: 'Phân tích & Xu hướng',
        icon: <TrendingUp className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/search',
        label: 'Tìm kiếm & Bộ lọc',
        icon: <Search className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/users',
        label: 'Quản lý Người dùng',
        icon: <Users className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN'],
      },
      {
        to: '/posts',
        label: 'Quản lý Bài viết',
        icon: <FileText className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/reports',
        label: 'Kiểm duyệt Báo cáo',
        icon: <ShieldAlert className="w-5 h-5 shrink-0" />,
        badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/groups',
        label: 'Quản lý Hội nhóm',
        icon: <Users2 className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN'],
      },
      {
        to: '/blacklist',
        label: 'Từ điển từ cấm',
        icon: <BookX className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/ai-moderation',
        label: 'Kiểm duyệt tự động AI',
        icon: <Cpu className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN', 'MODERATOR'],
      },
      {
        to: '/audit-logs',
        label: 'Nhật ký & Giám sát',
        icon: <History className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN'],
      },
      {
        to: '/settings',
        label: 'Cấu hình Hệ thống',
        icon: <Sliders className="w-5 h-5 shrink-0" />,
        roles: ['ADMIN'],
      },
    ],
    [pendingReportsCount]
  )

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => !isModerator || item.roles.includes('MODERATOR')),
    [navItems, isModerator]
  )

  return (
    <aside
      className={`h-screen bg-white dark:bg-[#242526] border-r border-[#e4e6eb] dark:border-[#393a3b] flex flex-col shrink-0 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* 1. Brand Logo, Title & Collapse Toggle */}
      <SidebarBrandHeader
        isCollapsed={isCollapsed}
        isModerator={isModerator}
        onToggle={() => dispatch(toggleSidebar())}
      />

      {/* 2. Navigation Items List */}
      <SidebarNavList
        items={visibleNavItems}
        isCollapsed={isCollapsed}
        isModerator={isModerator}
      />

      {/* 3. User Profile Card & Logout Actions */}
      <SidebarUserProfile
        user={user}
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
        onToggleExpand={() => dispatch(toggleSidebar())}
      />
    </aside>
  )
}

export default Sidebar
