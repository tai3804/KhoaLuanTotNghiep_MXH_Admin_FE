import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Shield, Mail, Calendar } from 'lucide-react'
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
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5]/80 dark:bg-[#18191A]/80 text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
                <th className="py-3 px-4">Thành viên</th>
                <th className="py-3 px-4">Email / Tài khoản</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Tương tác</th>
                <th className="py-3 px-4">Ngày tham gia</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E6EB] dark:divide-[#393A3B] text-xs">
              {paginatedUsers.map((u) => {
                const isCurrent = u.id === currentUserId || u.userId === currentUserId
                return (
                  <tr
                    key={u.id || u.userId}
                    className="hover:bg-[#F0F2F5]/70 dark:hover:bg-[#3A3B3C]/40 transition-colors"
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
                            <span className="font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
                              {u.fullName || 'Người dùng'}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF]">
                                Bạn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate">
                            @{u.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-[#65676B] dark:text-[#B0B3B8]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#65676B] dark:text-[#B0B3B8] shrink-0" />
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
                    <td className="py-3 px-4 text-[#65676B] dark:text-[#B0B3B8]">
                      <div className="text-[11px] space-y-0.5">
                        <p>{u.postsCount ?? 0} bài viết</p>
                        <p>{u.friendsCount ?? u.friendCount ?? 0} bạn bè</p>
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="py-3 px-4 text-[#65676B] dark:text-[#B0B3B8]">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-[#65676B] dark:text-[#B0B3B8]" />
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] bg-[#F0F2F5] dark:bg-[#3A3B3C] hover:bg-[#0866FF] hover:text-white dark:hover:bg-[#0866FF] transition-colors cursor-pointer"
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
          <div className="border-t border-[#E4E6EB] dark:border-[#393A3B] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#65676B] dark:text-[#B0B3B8]">
              <span>Hiển thị mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-[#F0F2F5] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB] text-xs font-semibold px-2 py-1 rounded-lg border border-[#E4E6EB] dark:border-[#393A3B] cursor-pointer"
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

