import api from './api'
import {
  ActivityHeatmapData,
  TrendingHashtag,
  DemographicsData,
} from '../types/analytics'

export const analyticsService = {
  getHeatmap: async (): Promise<ActivityHeatmapData> => {
    try {
      const response = await api.get('/api/v1/admin/analytics/heatmap')
      const resData = response.data
      if (resData && typeof resData === 'object') {
        if ('data' in resData && resData.data) return resData.data as ActivityHeatmapData
        return resData as ActivityHeatmapData
      }
    } catch (err) {
      console.warn('Analytics heatmap API fallback:', err)
    }

    return {
      days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
      hours: Array.from({ length: 24 }, (_, i) => i),
      matrix: Array.from({ length: 7 }, () => Array(24).fill(0)),
      peakTimeRange: '--:--',
      peakDay: '--',
      eveningActivityRatio: 0,
      totalWeeklyInteractions: 0,
    }
  },

  getTrendingHashtags: async (): Promise<TrendingHashtag[]> => {
    try {
      const response = await api.get('/api/v1/admin/analytics/trends')
      const resData = response.data
      if (Array.isArray(resData)) return resData
      if (resData && Array.isArray(resData.data)) return resData.data
    } catch (err) {
      console.warn('Analytics trends API error:', err)
    }

    return []
  },

  getDemographics: async (): Promise<DemographicsData> => {
    try {
      const response = await api.get('/api/v1/admin/analytics/demographics')
      const resData = response.data
      if (resData && typeof resData === 'object') {
        if ('data' in resData && resData.data) return resData.data as DemographicsData
        return resData as DemographicsData
      }
    } catch (err) {
      console.warn('Analytics demographics API error:', err)
    }

    return {
      deviceDistribution: {
        'Desktop / Laptop Web': 0,
        'Mobile Web (Safari & Chrome)': 0,
        'Tablet & iPad': 0,
      },
      browserDistribution: {
        'Google Chrome': 0,
        'Apple Safari': 0,
        'Microsoft Edge': 0,
        'Firefox & Khác': 0,
      },
      ageGroupDistribution: {
        '18 - 24 tuổi (Sinh viên)': 0,
        '25 - 34 tuổi (Người đi làm)': 0,
        '35 - 44 tuổi': 0,
        '45+ tuổi': 0,
      },
      averageRetentionRate: 0,
      dailyActiveRatio: 0,
    }
  },
}
