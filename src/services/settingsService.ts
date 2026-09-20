import api from './api'
import { BlacklistedWord, AuditLog, ServiceHealth } from '../types/settings'

export const settingsService = {
  getBlacklist: async (): Promise<BlacklistedWord[]> => {
    const response = await api.get('/api/v1/admin/settings/blacklist')
    const rawData = response.data
    const list: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return list.map((item) => ({
      id: item.id,
      word: item.word || item.keyword || '',
      category: item.category || 'Mặc định',
      severity: item.severity || 'MEDIUM',
      createdAt: item.createdAt,
    }))
  },

  addBlacklistWord: async (word: string): Promise<BlacklistedWord> => {
    const response = await api.post('/api/v1/admin/settings/blacklist', word, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    const resData = response.data
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data
    }
    return resData
  },

  removeBlacklistWord: async (id: number | string): Promise<void> => {
    await api.delete(`/api/v1/admin/settings/blacklist/${id}`)
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await api.get('/api/v1/admin/settings/audit-logs')
    const rawData = response.data
    const list: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return list.map((log) => ({
      id: log.id,
      adminId: String(log.adminId || ''),
      adminUsername: log.adminUsername || 'admin',
      action: log.action || 'ACTION',
      targetType: log.targetType || 'SYSTEM',
      targetId: String(log.targetId || ''),
      details: log.details || '',
      ipAddress: log.ipAddress || '127.0.0.1',
      createdAt: log.createdAt || new Date().toISOString(),
    }))
  },

  getServiceHealth: async (): Promise<ServiceHealth[]> => {
    try {
      const response = await api.get('/api/v1/admin/settings/service-health')
      const rawData = response.data
      if (Array.isArray(rawData)) return rawData
      if (rawData && Array.isArray(rawData.data)) return rawData.data
    } catch (e) {
      console.warn('Fallback getting service health:', e)
    }
    return []
  },
}
