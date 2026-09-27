export type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING_VERIFICATION' | 'INACTIVE'
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

export interface User {
  id: string
  userId?: string
  username: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  coverUrl?: string
  bio?: string
  phoneNumber?: string
  gender?: string
  dateOfBirth?: string
  location?: string
  website?: string
  role: UserRole | string
  status: UserStatus
  isBanned?: boolean
  banReason?: string
  bannedAt?: string
  bannedUntil?: string
  emailVerified?: boolean
  followerCount?: number
  followingCount?: number
  friendCount?: number
  postsCount?: number
  friendsCount?: number
  reportsCount?: number
  isOnline?: boolean
  lastActiveAt?: string
  createdAt: string
  updatedAt?: string
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
