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
    try {
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
    } catch (e) {
      console.warn('Fallback getting audit logs:', e)
      return []
    }
  },

  getServiceHealth: async (): Promise<ServiceHealth[]> => {
    try {
      const response = await api.get('/api/v1/admin/settings/service-health')
      const rawData = response.data
      const list: any[] = Array.isArray(rawData)
        ? rawData
        : rawData?.data && Array.isArray(rawData.data)
        ? rawData.data
        : []

      return list.map((svc) => ({
        name: svc.name,
        port: svc.port,
        status: svc.status,
        responseTimeMs: svc.responseTimeMs,
      }))
    } catch (e) {
      console.warn('Error fetching service health:', e)
      return []
    }
  },

  getSystemConfigs: async (): Promise<Record<string, string>> => {
    try {
      const response = await api.get('/api/v1/admin/settings/system')
      return response.data || {}
    } catch (e) {
      console.warn('Error fetching system configs:', e)
      return {}
    }
  },

  updateSystemConfigs: async (configs: Record<string, string>): Promise<Record<string, string>> => {
    const response = await api.put('/api/v1/admin/settings/system', configs)
    return response.data || {}
  },

  clearCache: async (type: string = 'all'): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/v1/admin/settings/clear-cache', null, {
      params: { type },
    })
    return response.data
  },
}
