import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AdminUser, AuthState } from '../../types/auth'

let storedUser: AdminUser | null = null
try {
  localStorage.removeItem('admin_refresh_token')
  const userStr = localStorage.getItem('admin_user')
  if (userStr) storedUser = JSON.parse(userStr)
} catch {
  // Ignore parse error
}

const initialState: AuthState = {
  token: null, // In-memory ONLY - never persisted
  user: storedUser,
  isAuthenticated: false, // Always start unauthenticated - ProtectedRoute will verify via refresh cookie
  isLoading: false,
  error: null,
}


export const parseTokenPayload = (token: string): any => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export const extractUserFromToken = (token: string): AdminUser | null => {
  try {
    const decoded = parseTokenPayload(token)
    if (!decoded) return null
    const roles: string[] = Array.isArray(decoded.roles) ? decoded.roles : []
    const role = roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')
      ? 'ADMIN'
      : roles.includes('ROLE_MODERATOR') || roles.includes('MODERATOR')
      ? 'MODERATOR'
      : 'USER'
    const nameParts = [decoded.lastName, decoded.middleName, decoded.firstName].filter(
      (s) => Boolean(s && String(s).trim())
    )
    const fullName =
      nameParts.length > 0
        ? nameParts.join(' ').trim()
        : decoded.fullName || decoded.email?.split('@')[0] || 'Admin'
    const avatarUrl = decoded.avatarUrl || decoded.avatar || undefined

    return {
      id: decoded.sub || 'admin',
      username: decoded.email?.split('@')[0] || decoded.email || 'admin',
      email: decoded.email || '',
      fullName,
      avatarUrl,
      role,
      roles,
      isActive: true,
    }
  } catch {
    return null
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: AdminUser; refreshToken?: string }>
    ) => {
      state.token = action.payload.token
      // Pure in-memory access token, refresh token is handled strictly via HttpOnly cookie
      if (action.payload.user) {
        state.user = action.payload.user
        localStorage.setItem('admin_user', JSON.stringify(action.payload.user))
      } else if (!state.user) {
        const decodedUser = extractUserFromToken(action.payload.token)
        if (decodedUser) {
          state.user = decodedUser
          localStorage.setItem('admin_user', JSON.stringify(decodedUser))
        }
      }
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<AdminUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('admin_user', JSON.stringify(state.user))
      }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_refresh_token')
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setCredentials, logout, setLoading, setError, updateUser } =
  authSlice.actions

export default authSlice.reducer

