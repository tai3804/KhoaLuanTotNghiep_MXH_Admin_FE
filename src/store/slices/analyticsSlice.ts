import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  ActivityHeatmapData,
  TrendingHashtag,
  DemographicsData,
  TimeRange,
} from '../../types/analytics'

interface AnalyticsState {
  heatmap: ActivityHeatmapData | null
  trends: TrendingHashtag[]
  demographics: DemographicsData | null
  selectedTimeRange: TimeRange
  isLoading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  heatmap: null,
  trends: [],
  demographics: null,
  selectedTimeRange: '7d',
  isLoading: false,
  error: null,
}

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setHeatmap: (state, action: PayloadAction<ActivityHeatmapData>) => {
      state.heatmap = action.payload
    },
    setTrends: (state, action: PayloadAction<TrendingHashtag[]>) => {
      state.trends = action.payload
    },
    setDemographics: (state, action: PayloadAction<DemographicsData>) => {
      state.demographics = action.payload
    },
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.selectedTimeRange = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setHeatmap,
  setTrends,
  setDemographics,
  setTimeRange,
  setLoading,
  setError,
} = analyticsSlice.actions

export default analyticsSlice.reducer
