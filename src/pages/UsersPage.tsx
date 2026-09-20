import React, { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setUsers,
  setSelectedUser,
  setFilter,
  updateUserStatus,
  setLoading,
  setActionLoading,
} from '../store/slices/userSlice'
import { addToast } from '../store/slices/toastSlice'
import { userService } from '../services/userService'
import { User } from '../types/user'
import UserFilterBar from '../components/users/UserFilterBar'
import UserTable from '../components/users/UserTable'
import UserDetailModal from '../components/users/UserDetailModal'
import BanUserModal from '../components/users/BanUserModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination from '../components/common/Pagination'

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { users, selectedUser, filter, isLoading, actionLoading } =
    useAppSelector((state) => state.user)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [unbanTarget, setUnbanTarget] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading(true))
      try {
        const data = await userService.getAllUsers()
        dispatch(setUsers({ users: data }))
      } catch (e) {
        console.error('Failed to load users:', e)
        dispatch(setUsers({ users: [] }))
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchUsers()
  }, [dispatch])

  // Filtered and searched users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        filter.searchQuery === '' ||
        u.fullName.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.searchQuery.toLowerCase())

      const matchesStatus =
        !filter.status ||
        filter.status === 'ALL' ||
        (filter.status === 'BANNED' && (u.isBanned || u.status === 'BANNED')) ||
        (filter.status === 'ACTIVE' && !u.isBanned && u.status === 'ACTIVE')

      const matchesRole =
        !filter.role || filter.role === 'ALL' || u.role === filter.role

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, filter])

  // Pagination slice
  const paginatedUsers = useMemo(() => {
    const start = (filter.page - 1) * filter.limit
    return filteredUsers.slice(start, start + filter.limit)
  }, [filteredUsers, filter.page, filter.limit])

  const handleBanConfirm = async (userId: string, reason: string) => {
    dispatch(setActionLoading(true))
    try {
      await userService.banUser(userId, reason)
      dispatch(
        updateUserStatus({ userId, isBanned: true, status: 'BANNED' })
      )
      dispatch(
        addToast({
          type: 'warning',
          title: 'Đã khóa tài khoản',
          message: `Đã khóa tài khoản người dùng thành công.`,
        })
      )
      setIsBanModalOpen(false)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể thực hiện thao tác khóa tài khoản.',
        })
      )
    }
  }

  const handleUnbanConfirm = async () => {
    if (!unbanTarget) return
    dispatch(setActionLoading(true))
    try {
      await userService.unbanUser(unbanTarget.id)
      dispatch(
        updateUserStatus({
          userId: unbanTarget.id,
          isBanned: false,
          status: 'ACTIVE',
        })
      )
      dispatch(
        addToast({
          type: 'success',
          title: 'Mở khóa thành công',
          message: `Đã khôi phục hoạt động cho tài khoản @${unbanTarget.username}`,
        })
      )
      setUnbanTarget(null)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể mở khóa tài khoản.',
        })
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Quản Lý Người Dùng
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Xem danh sách tài khoản, hồ sơ thành viên, xử lý khóa và mở khóa tài khoản
        </p>
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        filter={filter}
        onChange={(newFilter) => dispatch(setFilter(newFilter))}
      />

      {/* User Table */}
      <UserTable
        users={paginatedUsers}
        isLoading={isLoading}
        onViewDetail={(user) => {
          dispatch(setSelectedUser(user))
          setIsDetailOpen(true)
        }}
        onBanClick={(user) => {
          dispatch(setSelectedUser(user))
          setIsBanModalOpen(true)
        }}
        onUnbanClick={(user) => setUnbanTarget(user)}
      />

      {/* Pagination */}
      <Pagination
        currentPage={filter.page}
        totalItems={filteredUsers.length}
        pageSize={filter.limit}
        onPageChange={(page) => dispatch(setFilter({ page }))}
      />

      {/* Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Ban User Modal */}
      <BanUserModal
        user={selectedUser}
        isOpen={isBanModalOpen}
        isLoading={actionLoading}
        onClose={() => setIsBanModalOpen(false)}
        onConfirm={handleBanConfirm}
      />

      {/* Unban Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!unbanTarget}
        onClose={() => setUnbanTarget(null)}
        onConfirm={handleUnbanConfirm}
        title="Mở Khóa Tài Khoản"
        message={`Bạn có chắc chắn muốn mở khóa và cho phép @${unbanTarget?.username} tiếp tục hoạt động trên mạng xã hội?`}
        confirmText="Mở Khóa"
        isLoading={actionLoading}
      />
    </div>
  )
}

export default UsersPage
