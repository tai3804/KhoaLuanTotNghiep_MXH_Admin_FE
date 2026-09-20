export interface AdminUser {
  id: string
  username: string
  email: string
  fullName: string
  avatarUrl?: string
  role: 'ADMIN' | 'MODERATOR' | 'USER' | string
  roles?: string[]
  isActive?: boolean
  createdAt?: string
}

export interface LoginRequest {
  identifier: string // email or username
  password: string
}

export interface AuthResponse {
  accessToken: string
  tokenType?: string
  expiresIn?: number
  user?: AdminUser
  data?: {
    accessToken: string
    user: AdminUser
  }
}

export interface AuthState {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
