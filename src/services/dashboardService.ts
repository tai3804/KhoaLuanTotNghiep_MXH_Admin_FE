import api from './api'
import {
  DashboardStats,
  UserGrowthStat,
  InteractionStat,
  ReportCategoryStat,
} from '../types/dashboard'

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/api/v1/admin/dashboard/stats')
      const resData = response.data
      if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
        return resData.data as DashboardStats
      }
      if (resData && typeof resData === 'object') {
        return resData as DashboardStats
      }
    } catch (err) {
      console.warn('Dashboard stats fallback:', err)
    }
    return {
      totalUsers: 0,
      totalPosts: 0,
      totalReports: 0,
      pendingReports: 0,
      newUsersToday: 0,
      newPostsToday: 0,
      resolvedReportsToday: 0,
      activeUsersNow: 0,
    }
  },

  getUserGrowthStats: async (): Promise<UserGrowthStat[]> => {
    try {
      const response = await api.get('/api/v1/admin/dashboard/growth')
      const resData = response.data
      if (Array.isArray(resData)) return resData
      if (resData && Array.isArray(resData.data)) return resData.data
    } catch {
      // Backend fallback
    }
    return []
  },

  getInteractionStats: async (): Promise<InteractionStat[]> => {
    try {
      const response = await api.get('/api/v1/admin/dashboard/interactions')
      const resData = response.data
      if (Array.isArray(resData)) return resData
      if (resData && Array.isArray(resData.data)) return resData.data
    } catch {
      // Backend fallback
    }
    return []
  },

  getReportCategories: async (): Promise<ReportCategoryStat[]> => {
    try {
      const response = await api.get('/api/v1/admin/dashboard/report-categories')
      const resData = response.data
      if (Array.isArray(resData)) return resData
      if (resData && Array.isArray(resData.data)) return resData.data
    } catch {
      // Backend fallback
    }
    return []
  },
}

