import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Download, UserPlus, Bell, ShieldBan, X, KeyRound, CheckSquare } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setUsers,
  setSelectedUser,
  setFilter,
  updateUserStatus,
  updateUserRoleSuccess,
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
import Button from '../components/common/Button'
import CreateUserModal from '../components/users/CreateUserModal'
import ChangeRoleModal from '../components/users/ChangeRoleModal'
import ResetPasswordModal from '../components/users/ResetPasswordModal'
import SendNotificationModal from '../components/users/SendNotificationModal'
import UserPageHeader from '../components/users/UserPageHeader'
import UserBulkActionBar from '../components/users/UserBulkActionBar'

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.auth.user)
  const { users, selectedUser, filter, isLoading, actionLoading } =
    useAppSelector((state) => state.user)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [unbanTarget, setUnbanTarget] = useState<User | null>(null)
  const [roleTarget, setRoleTarget] = useState<User | null>(null)
  const [resetPasswordTarget, setResetPasswordTarget] = useState<User | null>(null)
  const [notificationTarget, setNotificationTarget] = useState<User | null>(null)
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const fetchUsers = useCallback(async () => {
    if (users.length === 0) {
      dispatch(setLoading(true))
    }
    try {
      const data = await userService.getAllUsers()
      dispatch(setUsers({ users: data }))
    } catch (e) {
      console.error('Failed to load users:', e)
      if (users.length === 0) {
        dispatch(setUsers({ users: [] }))
      }
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, users.length])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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

  const handleToggleSelectUser = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedUsers.map((u) => u.id))
    }
  }

  const handleCreateUserSubmit = async (formData: {
    fullName: string
    username: string
    email: string
    password?: string
    role: 'ADMIN' | 'MODERATOR' | 'USER'
    gender: string
  }) => {
    dispatch(setActionLoading(true))
    try {
      const nameParts = formData.fullName.trim().split(' ')
      const lastName = nameParts.length > 1 ? nameParts.pop() : ''
      const firstName = nameParts.join(' ') || formData.fullName

      await userService.createUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        firstName,
        lastName,
        gender: formData.gender,
      })

      dispatch(
        addToast({
          type: 'success',
          title: 'Tạo tài khoản thành công',
          message: `Đã tạo tài khoản @${formData.username} với vai trò ${formData.role}.`,
        })
      )
      setIsCreateModalOpen(false)
      fetchUsers()
    } catch (err: any) {
      throw err
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleBanConfirm = async (userId: string, reason: string) => {
    if (currentUser && (String(currentUser.id) === String(userId) || currentUser.email === selectedUser?.email)) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Hành động không hợp lệ',
          message: 'Bạn không thể tự khóa tài khoản của chính mình.',
        })
      )
      return
    }

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
    } finally {
      dispatch(setActionLoading(false))
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
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (currentUser && (String(currentUser.id) === String(userId) || (selectedUser && currentUser.email === selectedUser.email) || (roleTarget && currentUser.email === roleTarget.email))) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Hành động không hợp lệ',
          message: 'Bạn không thể tự thay đổi vai trò của chính mình.',
        })
      )
      return
    }

    dispatch(setActionLoading(true))
    try {
      await userService.updateRole(userId, newRole)
      dispatch(updateUserRoleSuccess({ userId, role: newRole }))
      dispatch(
        addToast({
          type: 'success',
          title: 'Đổi vai trò thành công',
          message: `Đã cập nhật vai trò thành ${newRole}.`,
        })
      )
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể cập nhật vai trò cho người dùng này.',
        })
      )
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleResetPasswordConfirm = async (userId: string, newPass: string) => {
    dispatch(setActionLoading(true))
    try {
      await userService.resetPassword(userId, newPass)
      dispatch(
        addToast({
          type: 'success',
          title: 'Đặt lại mật khẩu thành công',
          message: 'Mật khẩu mới đã được cập nhật và các phiên cũ đã bị thu hồi.',
        })
      )
      setResetPasswordTarget(null)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể đặt lại mật khẩu cho người dùng.',
        })
      )
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleRevokeSessions = async (user: User) => {
    if (currentUser && String(currentUser.id) === String(user.id)) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thao tác không hợp lệ',
          message: 'Không thể tự cưỡng chế đăng xuất phiên làm việc của chính bạn.',
        })
      )
      return
    }

    dispatch(setActionLoading(true))
    try {
      await userService.revokeSessions(user.id)
      dispatch(
        addToast({
          type: 'success',
          title: 'Cưỡng chế đăng xuất thành công',
          message: `Đã thu hồi toàn bộ phiên đăng nhập của @${user.username}.`,
        })
      )
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể thu hồi phiên đăng nhập.',
        })
      )
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleSendNotification = async (payload: {
    recipientId?: string
    title: string
    content: string
    type: string
  }) => {
    dispatch(setActionLoading(true))
    try {
      await userService.sendNotification(payload)
      dispatch(
        addToast({
          type: 'success',
          title: 'Gửi thông báo thành công',
          message: payload.recipientId ? 'Đã gửi thông báo đến thành viên.' : 'Đã phát thông báo toàn hệ thống.',
        })
      )
      setNotificationTarget(null)
      setIsBroadcastOpen(false)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể gửi thông báo lúc này.',
        })
      )
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleBulkBan = async () => {
    if (selectedIds.length === 0) return
    dispatch(setActionLoading(true))
    try {
      await userService.bulkBanUsers(selectedIds, 'Khóa hàng loạt bởi Quản Trị Viên')
      selectedIds.forEach((id) => {
        dispatch(updateUserStatus({ userId: id, isBanned: true, status: 'BANNED' }))
      })
      dispatch(
        addToast({
          type: 'warning',
          title: 'Khóa hàng loạt thành công',
          message: `Đã khóa ${selectedIds.length} tài khoản được chọn.`,
        })
      )
      setSelectedIds([])
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể thực hiện khóa hàng loạt.',
        })
      )
    } finally {
      dispatch(setActionLoading(false))
    }
  }

  const handleExportSelected = () => {
    const selectedUsers = users.filter((u) => selectedIds.includes(u.id))
    userService.exportUsersCsv(selectedUsers)
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <UserPageHeader
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onExportCsv={() => userService.exportUsersCsv(filteredUsers)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Filter Bar */}
      <UserFilterBar
        filter={filter}
        onChange={(newFilter) => dispatch(setFilter(newFilter))}
      />

      {/* Bulk Actions Floating Bar */}
      <UserBulkActionBar
        selectedCount={selectedIds.length}
        totalCount={paginatedUsers.length}
        onDeselectAll={() => setSelectedIds([])}
        onBulkBan={handleBulkBan}
        onBulkNotify={() => {
          setIsBroadcastOpen(true)
        }}
        onExportSelected={handleExportSelected}
      />

      {/* User Table */}
      <UserTable
        users={paginatedUsers}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelectUser}
        onToggleSelectAll={handleToggleSelectAll}
        onViewDetail={(user) => {
          dispatch(setSelectedUser(user))
          setIsDetailOpen(true)
        }}
        onRoleClick={(user) => setRoleTarget(user)}
        onBanClick={(user) => {
          dispatch(setSelectedUser(user))
          setIsBanModalOpen(true)
        }}
        onUnbanClick={(user) => setUnbanTarget(user)}
        onResetPasswordClick={(user) => setResetPasswordTarget(user)}
        onSendNotificationClick={(user) => setNotificationTarget(user)}
        onRevokeSessionsClick={handleRevokeSessions}
      />

      {/* Pagination */}
      <Pagination
        currentPage={filter.page}
        totalItems={filteredUsers.length}
        pageSize={filter.limit}
        onPageChange={(page) => dispatch(setFilter({ page }))}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        isLoading={actionLoading}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUserSubmit}
      />

      {/* Change Role Modal */}
      <ChangeRoleModal
        user={roleTarget}
        isOpen={!!roleTarget}
        isLoading={actionLoading}
        onClose={() => setRoleTarget(null)}
        onConfirm={handleRoleChange}
      />

      {/* Detail Modal with Role Changer & Actions */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRoleChange={handleRoleChange}
        onResetPassword={(u) => {
          setIsDetailOpen(false)
          setResetPasswordTarget(u)
        }}
        onRevokeSessions={handleRevokeSessions}
        onSendNotification={(u) => {
          setIsDetailOpen(false)
          setNotificationTarget(u)
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        user={resetPasswordTarget}
        isOpen={!!resetPasswordTarget}
        isLoading={actionLoading}
        onClose={() => setResetPasswordTarget(null)}
        onConfirm={handleResetPasswordConfirm}
      />

      {/* Send Notification Modal (Single User) */}
      <SendNotificationModal
        user={notificationTarget}
        isOpen={!!notificationTarget}
        isLoading={actionLoading}
        onClose={() => setNotificationTarget(null)}
        onSend={handleSendNotification}
      />

      {/* Broadcast Announcement Modal (All Users) */}
      <SendNotificationModal
        user={null}
        isOpen={isBroadcastOpen}
        isLoading={actionLoading}
        onClose={() => setIsBroadcastOpen(false)}
        onSend={handleSendNotification}
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
