import React, { useState } from 'react'
import {
  Eye,
  ShieldBan,
  ShieldCheck,
  UserCog,
  KeyRound,
  Bell,
  LogOut,
  Bot,
  MoreVertical,
  Download,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react'
import { User } from '../../types/user'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import { useAppSelector } from '../../store'

export interface UserTableProps {
  users: User[]
  isLoading?: boolean
  selectedIds?: string[]
  onToggleSelect?: (userId: string) => void
  onToggleSelectAll?: () => void
  onViewDetail: (user: User) => void
  onBanClick: (user: User) => void
  onUnbanClick: (user: User) => void
  onRoleClick?: (user: User) => void
  onResetPasswordClick?: (user: User) => void
  onSendNotificationClick?: (user: User) => void
  onRevokeSessionsClick?: (user: User) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onBanClick,
  onUnbanClick,
  onRoleClick,
  onResetPasswordClick,
  onSendNotificationClick,
  onRevokeSessionsClick,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user)
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null)

  const isAllSelected = users.length > 0 && selectedIds.length === users.length

  const isSuspectedBot = (user: User) => {
    // Heuristic: No avatar, 0 posts, 0 friends, created recently
    const hasDefaultAvatar = !user.avatarUrl || user.avatarUrl.includes('placeholder') || user.avatarUrl.includes('default')
    const hasNoActivity = (user.postsCount ?? 0) === 0 && (user.friendsCount ?? 0) === 0
    return hasDefaultAvatar && hasNoActivity && user.role === 'USER' && !user.isBanned
  }

  const columns: Column<User>[] = [
    ...(onToggleSelect
      ? [
          {
            header: (
              <button
                type="button"
                onClick={onToggleSelectAll}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                title={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-indigo-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            ) as any,
            className: 'w-10 text-center',
            cell: (user: User) => {
              const isSelected = selectedIds.includes(user.id)
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSelect(user.id)
                  }}
                  className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              )
            },
          },
        ]
      : []),
    {
      header: 'Thành Viên',
      cell: (user) => {
        const isSelf = Boolean(
          currentUser &&
            ((currentUser.id && String(currentUser.id) === String(user.id)) ||
              (currentUser.email && currentUser.email.toLowerCase() === user.email.toLowerCase()) ||
              (currentUser.username && currentUser.username.toLowerCase() === user.username.toLowerCase()))
        )
        const botSuspect = isSuspectedBot(user)

        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatarUrl}
              name={user.fullName || user.username}
              size="md"
              shape="rounded"
            />
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {user.fullName}
                </p>
                {isSelf && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">
                    Bạn
                  </span>
                )}
                {botSuspect && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5"
                    title="Hệ thống AI nhận diện: Tài khoản mới, chưa có tương tác & chưa có ảnh đại diện"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Nghi vấn Bot</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Email / SĐT',
      cell: (user) => (
        <div>
          <p className="text-slate-800 dark:text-slate-200">{user.email}</p>
          {user.phoneNumber && (
            <p className="text-xs text-slate-400">{user.phoneNumber}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Vai Trò',
      cell: (user) => {
        const variant =
          user.role === 'ADMIN'
            ? 'primary'
            : user.role === 'MODERATOR'
            ? 'warning'
            : 'neutral'
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant={variant} size="sm">
              {user.role}
            </Badge>
          </div>
        )
      },
    },
    {
      header: 'Trạng Thái',
      cell: (user) => {
        const isBanned = user.isBanned || user.status === 'BANNED'
        return (
          <Badge
            variant={isBanned ? 'danger' : 'success'}
            size="sm"
            dot
          >
            {isBanned ? 'Đã Khóa' : 'Hoạt Động'}
          </Badge>
        )
      },
    },
    {
      header: 'Tương Tác',
      cell: (user) => (
        <div className="text-xs text-slate-500">
          <span>{user.postsCount ?? 0} bài viết</span> •{' '}
          <span>{user.friendsCount ?? user.friendCount ?? 0} bạn bè</span>
        </div>
      ),
    },
    {
      header: 'Hành Động',
      className: 'text-right',
      cell: (user, index) => {
        const isBanned = user.isBanned || user.status === 'BANNED'
        const isSelf = Boolean(
          currentUser &&
            ((currentUser.id && String(currentUser.id) === String(user.id)) ||
              (currentUser.email && currentUser.email.toLowerCase() === user.email.toLowerCase()) ||
              (currentUser.username && currentUser.username.toLowerCase() === user.username.toLowerCase()))
        )

        const rowIndex = index !== undefined ? index : users.findIndex((u) => u.id === user.id)
        // For rows near the bottom or in small lists (not row 0), open upward so it won't get cut off
        const isNearBottom = rowIndex > 0 && (rowIndex >= users.length - 2 || users.length <= 3)

        return (
          <div className="flex items-center justify-end gap-1.5 relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetail(user)}
              title="Xem chi tiết hồ sơ"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {isSelf ? (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                Tài khoản hiện tại
              </span>
            ) : (
              <>
                {onRoleClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRoleClick(user)}
                    className="text-[#1877f2] hover:text-[#1877f2] border-blue-500/30 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Phân quyền vai trò"
                  >
                    <UserCog className="w-3.5 h-3.5 mr-1" />
                    <span>Quyền</span>
                  </Button>
                )}

                {isBanned ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUnbanClick(user)}
                    className="text-emerald-600 hover:text-emerald-700 border-emerald-500/30"
                    title="Mở khóa tài khoản"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Mở
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onBanClick(user)}
                    title="Khóa tài khoản"
                  >
                    <ShieldBan className="w-3.5 h-3.5 mr-1" />
                    Khóa
                  </Button>
                )}

                {/* More actions dropdown toggle */}
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveMenuUserId(activeMenuUserId === user.id ? null : user.id)
                    }}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      activeMenuUserId === user.id
                        ? 'bg-slate-100 dark:bg-slate-800 border-[#1877f2] text-[#1877f2]'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                    }`}
                    title="Tùy chọn khác"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {activeMenuUserId === user.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuUserId(null)
                        }}
                      />
                      <div
                        className={`absolute right-0 w-52 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 ${
                          isNearBottom
                            ? 'bottom-full mb-1.5 origin-bottom-right'
                            : 'top-full mt-1.5 origin-top-right'
                        }`}
                      >
                        {onResetPasswordClick && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuUserId(null)
                              onResetPasswordClick(user)
                            }}
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4 text-indigo-500" />
                            <span>Đặt lại mật khẩu</span>
                          </button>
                        )}

                        {onSendNotificationClick && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuUserId(null)
                              onSendNotificationClick(user)
                            }}
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                          >
                            <Bell className="w-4 h-4 text-amber-500" />
                            <span>Gửi cảnh báo / tin</span>
                          </button>
                        )}

                        {onRevokeSessionsClick && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuUserId(null)
                              onRevokeSessionsClick(user)
                            }}
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Cưỡng chế đăng xuất</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={users} isLoading={isLoading} />
}

export default UserTable

