export type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING_VERIFICATION' | 'INACTIVE'
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  avatarUrl?: string
  coverUrl?: string
  bio?: string
  phoneNumber?: string
  role: UserRole | string
  status: UserStatus
  isBanned?: boolean
  banReason?: string
  bannedAt?: string
  bannedUntil?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string
  postsCount?: number
  friendsCount?: number
  reportsCount?: number
}

export interface UserFilter {
  searchQuery: string
  status?: UserStatus | 'ALL'
  role?: UserRole | 'ALL'
  page: number
  limit: number
}

export interface BanUserPayload {
  userId: string
  reason?: string
  durationDays?: number // 0 for permanent
}
