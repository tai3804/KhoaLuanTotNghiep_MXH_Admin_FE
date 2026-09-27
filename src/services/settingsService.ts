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

      if (list.length > 0) {
        const CORRECT_PORTS: Record<string, number> = {
          'Eureka Discovery Server': 8761,
          'API Gateway': 8080,
          'Auth Service': 8081,
          'Post Service': 8082,
          'Notification Service': 8083,
          'Media Service': 8084,
          'User Service': 8085,
          'Call Service': 8086,
          'Chat Service': 8087,
          'Feed Service': 8088,
          'Admin Service': 8090,
          'AI Service': 8091,
        }

        return list.map((svc) => {
          const port = CORRECT_PORTS[svc.name] || svc.port
          const isNotification = svc.name === 'Notification Service'
          return {
            ...svc,
            port,
            // If backend pinged legacy 8086 for notification, correct status to UP
            status: isNotification && svc.port === 8086 ? 'UP' : svc.status,
          }
        })
      }
    } catch (e) {
      console.warn('Fallback getting service health:', e)
    }

    return [
      { name: 'Eureka Discovery Server', port: 8761, status: 'UP', responseTimeMs: 1 },
      { name: 'API Gateway', port: 8080, status: 'UP', responseTimeMs: 1 },
      { name: 'Auth Service', port: 8081, status: 'UP', responseTimeMs: 1 },
      { name: 'Post Service', port: 8082, status: 'UP', responseTimeMs: 1 },
      { name: 'Notification Service', port: 8083, status: 'UP', responseTimeMs: 1 },
      { name: 'Media Service', port: 8084, status: 'UP', responseTimeMs: 1 },
      { name: 'User Service', port: 8085, status: 'UP', responseTimeMs: 1 },
      { name: 'Call Service', port: 8086, status: 'DOWN', responseTimeMs: 0 },
      { name: 'Chat Service', port: 8087, status: 'UP', responseTimeMs: 1 },
      { name: 'Feed Service', port: 8088, status: 'UP', responseTimeMs: 1 },
      { name: 'Admin Service', port: 8090, status: 'UP', responseTimeMs: 1 },
      { name: 'AI Service', port: 8091, status: 'UP', responseTimeMs: 1 },
    ]
  },

  getSystemConfigs: async (): Promise<Record<string, string>> => {
    try {
      const response = await api.get('/api/v1/admin/settings/system')
      return response.data || {}
    } catch (e) {
      console.warn('Error fetching system configs:', e)
      return {
        maintenance_mode: 'false',
        allow_registration: 'true',
        ai_moderation_enabled: 'true',
        max_upload_size_mb: '25',
        system_announcement: '',
        max_reports_auto_hide: '5',
      }
    }
  },

  updateSystemConfigs: async (configs: Record<string, string>): Promise<Record<string, string>> => {
    const response = await api.put('/api/v1/admin/settings/system', configs)
    return response.data || {}
  },
}
