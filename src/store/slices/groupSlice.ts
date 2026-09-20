import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Group } from '../../types/group'

interface GroupState {
  groups: Group[]
  isLoading: boolean
  actionLoading: boolean
  error: string | null
}

const initialState: GroupState = {
  groups: [],
  isLoading: false,
  actionLoading: false,
  error: null,
}

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setActionLoading: (state, action: PayloadAction<boolean>) => {
      state.actionLoading = action.payload
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload
      state.isLoading = false
      state.error = null
    },
    deleteGroupSuccess: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload)
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
  setGroups,
  deleteGroupSuccess,
  setError,
} = groupSlice.actions

export default groupSlice.reducer
