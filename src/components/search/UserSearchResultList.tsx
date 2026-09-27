import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Shield, Users, Mail, Calendar } from 'lucide-react'
import { User } from '../../types/user'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Pagination from '../common/Pagination'

interface UserSearchResultListProps {
  users: User[]
  currentUserId?: string
}

export const UserSearchResultList: React.FC<UserSearchResultListProps> = ({
  users,
  currentUserId,
}) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 when data changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [users.length])

  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getRoleBadgeVariant = (role: string): 'primary' | 'warning' | 'neutral' => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'primary'
      case 'MODERATOR':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  const getStatusBadge = (user: User) => {
    if (user.isBanned || user.status === 'BANNED') {
      return <Badge variant="danger" size="sm">Đã bị khóa</Badge>
    }
    if (user.status === 'PENDING_VERIFICATION') {
      return <Badge variant="warning" size="sm">Chờ xác minh</Badge>
    }
    return <Badge variant="success" size="sm">Hoạt động</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#393a3b] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#393a3b] bg-slate-50/75 dark:bg-[#1c1e21]/75 text-[11px] font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider">
                <th className="py-3 px-4">Thành viên</th>
                <th className="py-3 px-4">Email / Tài khoản</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Tương tác</th>
                <th className="py-3 px-4">Ngày tham gia</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#393a3b]/60 text-xs">
              {paginatedUsers.map((u) => {
                const isCurrent = u.id === currentUserId || u.userId === currentUserId
                return (
                  <tr
                    key={u.id || u.userId}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#3a3b3c]/40 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={u.avatarUrl}
                          name={u.fullName || u.username}
                          size="md"
                          shape="rounded"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-[#e4e6eb] truncate">
                              {u.fullName || 'Người dùng'}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#1877f2]/10 text-[#1877f2]">
                                Bạn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-[#b0b3b8] truncate">
                            @{u.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-600 dark:text-[#b0b3b8]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.email || 'Không có email'}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <Badge variant={getRoleBadgeVariant(u.role)} size="sm">
                        <Shield className="w-3 h-3 mr-1" />
                        {u.role || 'USER'}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(u)}
                    </td>

                    {/* Engagement / Counts */}
                    <td className="py-3 px-4 text-slate-500 dark:text-[#b0b3b8]">
                      <div className="text-[11px] space-y-0.5">
                        <p>{u.postsCount ?? 0} bài viết</p>
                        <p>{u.friendsCount ?? u.friendCount ?? 0} bạn bè</p>
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="py-3 px-4 text-slate-500 dark:text-[#b0b3b8]">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString('vi-VN')
                            : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate('/users')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-[#e4e6eb] bg-slate-100 dark:bg-[#3a3b3c] hover:bg-[#1877f2] hover:text-white dark:hover:bg-[#1877f2] transition-colors cursor-pointer"
                        title="Xem chi tiết tại trang Quản lý Người dùng"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem hồ sơ</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {users.length > 0 && (
          <div className="border-t border-slate-200 dark:border-[#393a3b] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#b0b3b8]">
              <span>Hiển thị mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-slate-50 dark:bg-[#18191a] text-slate-800 dark:text-[#e4e6eb] text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-[#393a3b] cursor-pointer"
              >
                <option value={5}>5 mục</option>
                <option value={10}>10 mục</option>
                <option value={20}>20 mục</option>
                <option value={50}>50 mục</option>
              </select>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={users.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserSearchResultList
