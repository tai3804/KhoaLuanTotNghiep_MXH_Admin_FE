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
        username: u.username || u.email?.split('@')[0] || u.id,
        email: u.email || '',
        fullName,
        avatarUrl: u.avatarUrl,
        coverUrl: u.coverUrl,
        bio: u.bio,
        phoneNumber: u.phoneNumber,
        role: u.role || 'USER',
        status: isBanned ? 'BANNED' : u.status || 'ACTIVE',
        isBanned,
        banReason: u.banReason,
        bannedAt: u.bannedAt,
        bannedUntil: u.bannedUntil,
        emailVerified: u.emailVerified ?? true,
        createdAt: u.createdAt || new Date().toISOString(),
        postsCount: u.postsCount ?? 0,
        friendsCount: u.friendsCount ?? 0,
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
}
