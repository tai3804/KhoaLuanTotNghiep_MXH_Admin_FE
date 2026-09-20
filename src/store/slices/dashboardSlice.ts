import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  DashboardStats,
  UserGrowthStat,
  InteractionStat,
  ReportCategoryStat,
} from '../../types/dashboard'

interface DashboardState {
  stats: DashboardStats | null
  userGrowth: UserGrowthStat[]
  interactions: InteractionStat[]
  reportCategories: ReportCategoryStat[]
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: null,
  userGrowth: [],
  interactions: [],
  reportCategories: [],
  isLoading: false,
  error: null,
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload
      state.isLoading = false
      state.error = null
    },
    setChartsData: (
      state,
      action: PayloadAction<{
        userGrowth: UserGrowthStat[]
        interactions: InteractionStat[]
        reportCategories: ReportCategoryStat[]
      }>
    ) => {
      state.userGrowth = action.payload.userGrowth
      state.interactions = action.payload.interactions
      state.reportCategories = action.payload.reportCategories
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setStats, setChartsData, setLoading, setError } =
  dashboardSlice.actions

export default dashboardSlice.reducer
