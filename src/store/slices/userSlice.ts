import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserFilter } from '../../types/user'

interface UserState {
  users: User[]
  totalCount: number
  selectedUser: User | null
  filter: UserFilter
  isLoading: boolean
  actionLoading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  totalCount: 0,
  selectedUser: null,
  filter: {
    searchQuery: '',
    status: 'ALL',
    role: 'ALL',
    page: 1,
    limit: 10,
  },
  isLoading: false,
  actionLoading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setActionLoading: (state, action: PayloadAction<boolean>) => {
      state.actionLoading = action.payload
    },
    setUsers: (
      state,
      action: PayloadAction<{ users: User[]; totalCount?: number }>
    ) => {
      state.users = action.payload.users
      state.totalCount = action.payload.totalCount ?? action.payload.users.length
      state.isLoading = false
      state.error = null
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    setFilter: (state, action: PayloadAction<Partial<UserFilter>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{ userId: string; isBanned: boolean; status: User['status'] }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId)
      if (user) {
        user.isBanned = action.payload.isBanned
        user.status = action.payload.status
      }
      if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
        state.selectedUser.isBanned = action.payload.isBanned
        state.selectedUser.status = action.payload.status
      }
      state.actionLoading = false
    },
    updateUserRoleSuccess: (
      state,
      action: PayloadAction<{ userId: string; role: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId)
      if (user) {
        user.role = action.payload.role as any
      }
      if (state.selectedUser && state.selectedUser.id === action.payload.userId) {
        state.selectedUser.role = action.payload.role as any
      }
      state.actionLoading = false
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
      state.actionLoading = false
    },
  },
})

export const {
  setLoading,
  setActionLoading,
  setUsers,
  setSelectedUser,
  setFilter,
  updateUserStatus,
  updateUserRoleSuccess,
  setError,
} = userSlice.actions

export default userSlice.reducer
