import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCheck,
  ExternalLink,
  Loader2,
  RefreshCw,
  Clock,
  ChevronRight
} from 'lucide-react'
import { notificationService, AdminNotification } from '../../services/notificationService'
import Badge from '../common/Badge'

export interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  onUpdateUnreadCount?: (count: number) => void
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onUpdateUnreadCount,
}) => {
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'ALL' | 'REPORT' | 'SYSTEM'>('ALL')

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
      const unread = data.filter((n) => !n.isRead).length
      if (onUpdateUnreadCount) onUpdateUnreadCount(unread)
    } catch (err) {
      console.warn('Failed to load notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleMarkAllRead = async () => {
    const ids = notifications.map((n) => n.id)
    await notificationService.markAllAsRead(ids)
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    if (onUpdateUnreadCount) onUpdateUnreadCount(0)
  }

  const handleMarkSingleRead = (item: AdminNotification, e: React.MouseEvent) => {
    e.stopPropagation()
    notificationService.markAsRead(item.id)
    const updated = notifications.map((n) =>
      n.id === item.id ? { ...n, isRead: true } : n
    )
    setNotifications(updated)
    const unread = updated.filter((n) => !n.isRead).length
    if (onUpdateUnreadCount) onUpdateUnreadCount(unread)
  }

  const handleItemClick = (item: AdminNotification) => {
    if (!item.isRead) {
      notificationService.markAsRead(item.id)
      const updated = notifications.map((n) =>
        n.id === item.id ? { ...n, isRead: true } : n
      )
      setNotifications(updated)
      const unread = updated.filter((n) => !n.isRead).length
      if (onUpdateUnreadCount) onUpdateUnreadCount(unread)
    }
    onClose()
    if (item.link) {
      navigate(item.link)
    } else {
      navigate('/reports')
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'REPORT') return n.type === 'REPORT'
    return n.type !== 'REPORT'
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-84 sm:w-96 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#E4E6EB] dark:border-[#393A3B] flex items-center justify-between bg-[#F0F2F5]/70 dark:bg-[#18191A]/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#0866FF] dark:text-[#2D88FF]" />
            Thông Báo Quản Trị
          </h3>
          {unreadCount > 0 && (
            <Badge variant="danger" size="sm">
              {unreadCount} mới
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={fetchNotifications}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB] hover:bg-[#E4E6EB]/60 dark:hover:bg-[#3A3B3C]/60 transition cursor-pointer"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-[#0866FF] dark:text-[#2D88FF] hover:underline flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer"
              title="Đánh dấu tất cả là đã đọc"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Đã đọc hết
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#E4E6EB] dark:border-[#393A3B] text-xs font-semibold px-2 bg-[#F0F2F5]/40 dark:bg-[#18191A]/30">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'ALL'
              ? 'border-[#0866FF] text-[#0866FF] dark:border-[#2D88FF] dark:text-[#2D88FF]'
              : 'border-transparent text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB]'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'REPORT'
              ? 'border-[#FA383E] text-[#FA383E]'
              : 'border-transparent text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB]'
          }`}
        >
          Vi phạm ({notifications.filter((n) => n.type === 'REPORT').length})
        </button>
        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'SYSTEM'
              ? 'border-[#0866FF] text-[#0866FF] dark:border-[#2D88FF] dark:text-[#2D88FF]'
              : 'border-transparent text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB]'
          }`}
        >
          Hệ thống ({notifications.filter((n) => n.type !== 'REPORT').length})
        </button>
      </div>

      {/* Notification List Body */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E4E6EB] dark:divide-[#393A3B]">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2 text-[#65676B]">
            <Loader2 className="w-5 h-5 animate-spin text-[#0866FF] dark:text-[#2D88FF]" />
            <span className="text-xs">Đang kiểm tra thông báo...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-1 text-[#65676B] dark:text-[#B0B3B8]">
            <Bell className="w-8 h-8 mx-auto opacity-30 mb-2" />
            <p className="text-xs font-semibold">Không có thông báo nào</p>
            <p className="text-[11px]">Hệ thống hiện tại đang hoạt động bình thường.</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition relative group ${
                !item.isRead
                  ? 'bg-[#E7F3FF]/70 dark:bg-[#0866FF]/10 hover:bg-[#E7F3FF] dark:hover:bg-[#0866FF]/20'
                  : 'hover:bg-[#F0F2F5]/70 dark:hover:bg-[#3A3B3C]/40 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {item.type === 'REPORT' ? (
                  <div className="w-8 h-8 rounded-full bg-[#FEE2E2] text-[#FA383E] dark:bg-[#FA383E]/20 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : item.type === 'SECURITY' ? (
                  <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#B78103] dark:bg-[#F5C33B]/20 dark:text-[#F5C33B] flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#E7F3FF] text-[#0866FF] dark:bg-[#0866FF]/20 dark:text-[#2D88FF] flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-xs truncate ${
                      !item.isRead
                        ? 'font-bold text-[#050505] dark:text-[#E4E6EB]'
                        : 'font-medium text-[#65676B] dark:text-[#B0B3B8]'
                    }`}
                  >
                    {item.title}
                  </h4>
                  {!item.isRead ? (
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-[#0866FF] ring-2 ring-blue-200 dark:ring-blue-900 flex-shrink-0"
                      title="Chưa đọc"
                    />
                  ) : (
                    <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] flex-shrink-0">
                      Đã đọc
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5 line-clamp-2">
                  {item.message}
                </p>

                <div className="flex items-center justify-between mt-1.5 text-[11px] text-[#65676B] dark:text-[#B0B3B8]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleString('vi-VN')}</span>
                    {item.targetType && (
                      <Badge variant="neutral" size="sm">
                        {item.targetType}
                      </Badge>
                    )}
                  </div>

                  {!item.isRead && (
                    <button
                      onClick={(e) => handleMarkSingleRead(item, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium text-[#0866FF] dark:text-[#2D88FF] hover:underline flex items-center gap-0.5"
                      title="Đánh dấu đã đọc"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Đánh dấu đã đọc</span>
                    </button>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#65676B] dark:text-[#B0B3B8] flex-shrink-0 self-center" />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#F0F2F5]/70 dark:bg-[#18191A] border-t border-[#E4E6EB] dark:border-[#393A3B] flex items-center justify-between text-xs">
        <button
          onClick={() => {
            onClose()
            navigate('/reports')
          }}
          className="text-[#0866FF] dark:text-[#2D88FF] font-semibold hover:underline flex items-center gap-1 px-2 py-1 rounded cursor-pointer"
        >
          <span>Trung tâm kiểm duyệt</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <button
          onClick={() => {
            onClose()
            navigate('/audit-logs')
          }}
          className="text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB] font-medium px-2 py-1 rounded cursor-pointer"
        >
          Nhật ký hệ thống
        </button>
      </div>
    </div>
  )
}

export default NotificationDropdown
