import api from './api'
import { User } from '../types/user'

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/api/v1/admin/users')
    const rawData = response.data
    const usersList: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return usersList.map((u) => {
      const fullName =
        u.fullName ||
        `${u.firstName || ''} ${u.lastName || ''}`.trim() ||
        u.username ||
        u.email ||
        'Người dùng'

      const isBanned = u.isBanned ?? u.status === 'BANNED'

      return {
        id: String(u.id || u.userId),
        userId: String(u.userId || u.id),
        username: u.username || u.email?.split('@')[0] || u.id,
        email: u.email || '',
        fullName,
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        coverUrl: u.coverUrl,
        bio: u.bio,
        gender: u.gender,
        phoneNumber: u.phoneNumber,
        dateOfBirth: u.dateOfBirth,
        location: u.location,
        website: u.website,
        isOnline: u.isOnline,
        lastActiveAt: u.lastActiveAt,
        role: u.role || 'USER',
        status: isBanned ? 'BANNED' : u.status || 'ACTIVE',
        isBanned,
        banReason: u.banReason,
        bannedAt: u.bannedAt,
        bannedUntil: u.bannedUntil,
        emailVerified: u.emailVerified ?? true,
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: u.updatedAt,
        postsCount: u.postsCount ?? 0,
        friendsCount: u.friendsCount ?? u.friendCount ?? 0,
        friendCount: u.friendCount ?? u.friendsCount ?? 0,
        followerCount: u.followerCount ?? 0,
        followingCount: u.followingCount ?? 0,
        reportsCount: u.reportsCount ?? 0,
      } as User
    })
  },

  banUser: async (userId: string, reason?: string): Promise<void> => {
    await api.put(`/api/v1/admin/users/${userId}/ban`, { reason })
  },

  unbanUser: async (userId: string): Promise<void> => {
    await api.put(`/api/v1/admin/users/${userId}/unban`)
  },

  updateRole: async (userId: string, role: string): Promise<void> => {
    await api.put(`/api/v1/admin/users/${userId}/role`, { role })
  },

  resetPassword: async (userId: string, newPassword: string): Promise<void> => {
    await api.put(`/api/v1/admin/users/${userId}/reset-password`, { newPassword })
  },

  revokeSessions: async (userId: string): Promise<void> => {
    await api.put(`/api/v1/admin/users/${userId}/revoke-sessions`)
  },

  sendNotification: async (payload: {
    recipientId?: string
    title: string
    content: string
    type: string
  }): Promise<void> => {
    await api.post('/api/v1/admin/users/notifications/send', payload)
  },

  bulkBanUsers: async (userIds: string[], reason: string): Promise<void> => {
    await Promise.all(userIds.map((id) => api.put(`/api/v1/admin/users/${id}/ban`, { reason })))
  },

  createUser: async (payload: {
    email: string
    password?: string
    username?: string
    firstName?: string
    lastName?: string
    role?: 'ADMIN' | 'MODERATOR' | 'USER'
    gender?: string
  }): Promise<any> => {
    const response = await api.post('/api/v1/admin/users', payload)
    return response.data
  },

  exportUsersCsv: (users: User[]): void => {
    if (!users || users.length === 0) return

    const headers = ['ID', 'Họ Và Tên', 'Username', 'Email', 'Vai Trò', 'Trạng Thái', 'Ngày Tạo']
    const rows = users.map((u) => [
      `"${u.id}"`,
      `"${u.fullName.replace(/"/g, '""')}"`,
      `"${u.username}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.isBanned ? 'BANNED' : u.status}"`,
      `"${new Date(u.createdAt).toLocaleDateString('vi-VN')}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `danh_sach_thanh_vien_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}

export default userService
