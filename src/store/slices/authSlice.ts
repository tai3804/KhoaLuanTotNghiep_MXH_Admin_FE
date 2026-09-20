import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AdminUser, AuthState } from '../../types/auth'

let storedUser: AdminUser | null = null
try {
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


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: AdminUser }>
    ) => {
      state.token = action.payload.token
      if (action.payload.user) {
        state.user = action.payload.user
        localStorage.setItem('admin_user', JSON.stringify(action.payload.user))
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

