import React from 'react'
import { Eye, ShieldBan, ShieldCheck } from 'lucide-react'
import { User } from '../../types/user'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

export interface UserTableProps {
  users: User[]
  isLoading?: boolean
  onViewDetail: (user: User) => void
  onBanClick: (user: User) => void
  onUnbanClick: (user: User) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onViewDetail,
  onBanClick,
  onUnbanClick,
}) => {
  const columns: Column<User>[] = [
    {
      header: 'Thành Viên',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={user.avatarUrl}
            name={user.fullName || user.username}
            size="md"
            shape="rounded"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-400">@{user.username}</p>
          </div>
        </div>
      ),
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
          <Badge variant={variant} size="sm">
            {user.role}
          </Badge>
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
          <span>{user.friendsCount ?? 0} bạn bè</span>
        </div>
      ),
    },
    {
      header: 'Hành Động',
      className: 'text-right',
      cell: (user) => {
        const isBanned = user.isBanned || user.status === 'BANNED'
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetail(user)}
              title="Xem chi tiết"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {isBanned ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUnbanClick(user)}
                className="text-emerald-600 hover:text-emerald-700 border-emerald-500/30"
                title="Mở khóa tài khoản"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Mở khóa
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
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={users} isLoading={isLoading} />
}

export default UserTable
