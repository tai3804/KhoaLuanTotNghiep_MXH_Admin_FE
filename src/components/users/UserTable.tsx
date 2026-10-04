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
                className="text-[#65676b] hover:text-[#050505] dark:hover:text-[#e4e6eb] transition-colors p-1 cursor-pointer"
                title={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#0866ff]" />
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
                  className="text-[#65676b] hover:text-[#0866ff] transition-colors p-1 cursor-pointer"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#0866ff]" />
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
                <p className="font-bold text-[#050505] dark:text-[#e4e6eb]">
                  {user.fullName}
                </p>
                {isSelf && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] font-bold">
                    Bạn
                  </span>
                )}
                {botSuspect && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#fff8e1] text-[#b78103] dark:bg-[#f5c33b]/20 dark:text-[#f5c33b] font-bold flex items-center gap-0.5"
                    title="Hệ thống AI nhận diện: Tài khoản mới, chưa có tương tác & chưa có ảnh đại diện"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Nghi vấn Bot</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">@{user.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Email / SĐT',
      cell: (user) => (
        <div>
          <p className="text-[#050505] dark:text-[#e4e6eb] font-medium">{user.email}</p>
          {user.phoneNumber && (
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">{user.phoneNumber}</p>
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
        <div className="text-xs text-[#65676b] dark:text-[#b0b3b8] font-medium">
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
              <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] font-semibold px-2.5 py-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-xl">
                Tài khoản hiện tại
              </span>
            ) : (
              <>
                {onRoleClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRoleClick(user)}
                    className="text-[#0866ff] hover:text-[#0866ff] border-[#0866ff]/30 hover:bg-[#e7f3ff] dark:hover:bg-[#0866ff]/20"
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
                    className="text-[#31a24c] hover:text-[#31a24c] border-[#31a24c]/30 hover:bg-[#e7f8ed] dark:hover:bg-[#31a24c]/20"
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
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      activeMenuUserId === user.id
                        ? 'bg-[#f0f2f5] dark:bg-[#3a3b3c] border-[#0866ff] text-[#0866ff]'
                        : 'border-[#e4e6eb] dark:border-[#393a3b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8]'
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
                        className={`absolute right-0 w-52 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-[#e4e6eb] dark:border-[#393a3b] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 ${
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
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] font-semibold transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4 text-[#0866ff]" />
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
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] font-semibold transition-colors cursor-pointer"
                          >
                            <Bell className="w-4 h-4 text-[#f5c33b]" />
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
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#ffebe8] dark:hover:bg-[#fa383e]/20 text-[#fa383e] font-semibold transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-[#fa383e]" />
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


