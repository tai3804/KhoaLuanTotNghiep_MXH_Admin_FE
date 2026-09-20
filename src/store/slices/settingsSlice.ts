import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlacklistedWord, AuditLog, ServiceHealth } from '../../types/settings'

interface SettingsState {
  blacklist: BlacklistedWord[]
  auditLogs: AuditLog[]
  services: ServiceHealth[]
  isLoading: boolean
  actionLoading: boolean
  error: string | null
}

const initialState: SettingsState = {
  blacklist: [],
  auditLogs: [],
  services: [],
  isLoading: false,
  actionLoading: false,
  error: null,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setActionLoading: (state, action: PayloadAction<boolean>) => {
      state.actionLoading = action.payload
    },
    setBlacklist: (state, action: PayloadAction<BlacklistedWord[]>) => {
      state.blacklist = action.payload
      state.isLoading = false
      state.error = null
    },
    addBlacklistWordSuccess: (state, action: PayloadAction<BlacklistedWord>) => {
      state.blacklist.unshift(action.payload)
      state.actionLoading = false
    },
    removeBlacklistWordSuccess: (state, action: PayloadAction<number | string>) => {
      state.blacklist = state.blacklist.filter((w) => String(w.id) !== String(action.payload))
      state.actionLoading = false
    },
    setAuditLogs: (state, action: PayloadAction<AuditLog[]>) => {
      state.auditLogs = action.payload
      state.isLoading = false
      state.error = null
    },
    setServiceHealth: (state, action: PayloadAction<ServiceHealth[]>) => {
      state.services = action.payload
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
  setBlacklist,
  addBlacklistWordSuccess,
  removeBlacklistWordSuccess,
  setAuditLogs,
  setServiceHealth,
  setError,
} = settingsSlice.actions

export default settingsSlice.reducer
