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
      className="absolute right-0 top-full mt-2 w-84 sm:w-96 rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#1c1e21]/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#1877f2]" />
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-[#1877f2] dark:text-[#4599ff] hover:underline flex items-center gap-1 px-1.5 py-1 rounded"
              title="Đánh dấu tất cả là đã đọc"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Đã đọc hết
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-100 dark:border-slate-800 text-xs font-semibold px-2 bg-slate-50/40 dark:bg-[#1c1e21]/30">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'ALL'
              ? 'border-[#1877f2] text-[#1877f2] dark:text-[#4599ff]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'REPORT'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Vi phạm ({notifications.filter((n) => n.type === 'REPORT').length})
        </button>
        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`flex-1 py-2 text-center border-b-2 transition ${
            activeTab === 'SYSTEM'
              ? 'border-[#1877f2] text-[#1877f2] dark:text-[#4599ff]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Hệ thống ({notifications.filter((n) => n.type !== 'REPORT').length})
        </button>
      </div>

      {/* Notification List Body */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#1877f2]" />
            <span className="text-xs">Đang kiểm tra thông báo...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-1 text-slate-400 dark:text-slate-500">
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
                  ? 'bg-blue-50/70 dark:bg-[#1877f2]/10 hover:bg-blue-100/60 dark:hover:bg-[#1877f2]/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {item.type === 'REPORT' ? (
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : item.type === 'SECURITY' ? (
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
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
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'font-medium text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.title}
                  </h4>
                  {!item.isRead ? (
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-[#1877f2] ring-2 ring-blue-200 dark:ring-blue-900 flex-shrink-0"
                      title="Chưa đọc"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                      Đã đọc
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {item.message}
                </p>

                <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium text-[#1877f2] hover:underline flex items-center gap-0.5"
                      title="Đánh dấu đã đọc"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Đánh dấu đã đọc</span>
                    </button>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0 self-center" />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 dark:bg-[#1c1e21] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={() => {
            onClose()
            navigate('/reports')
          }}
          className="text-[#1877f2] dark:text-[#4599ff] font-semibold hover:underline flex items-center gap-1 px-2 py-1 rounded"
        >
          <span>Trung tâm kiểm duyệt</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <button
          onClick={() => {
            onClose()
            navigate('/audit-logs')
          }}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium px-2 py-1 rounded"
        >
          Nhật ký hệ thống
        </button>
      </div>
    </div>
  )
}

export default NotificationDropdown
