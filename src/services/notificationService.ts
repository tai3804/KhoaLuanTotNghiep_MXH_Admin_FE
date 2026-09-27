import api from './api'

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: 'REPORT' | 'SECURITY' | 'SYSTEM' | 'USER' | 'POST'
  targetType?: string
  targetId?: string
  createdAt: string
  isRead: boolean
  link?: string
  actionUrl?: string
}

const READ_STORAGE_KEY = 'admin_read_notification_ids'

const getReadIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem(READ_STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

const saveReadIds = (set: Set<string>) => {
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(set)))
  } catch {
    // ignore
  }
}

export const notificationService = {
  getNotifications: async (): Promise<AdminNotification[]> => {
    try {
      const readIds = getReadIds()

      // 1. Fetch pending violation reports to form active violation alerts
      const reportRes = await api.get('/api/v1/moderation/reports?status=PENDING&size=10')
      const rawReports = reportRes.data
      const reportList: any[] = Array.isArray(rawReports)
        ? rawReports
        : Array.isArray(rawReports?.data)
        ? rawReports.data
        : Array.isArray(rawReports?.data?.content)
        ? rawReports.data.content
        : []

      const reportNotifications: AdminNotification[] = reportList.map((r: any) => {
        const reportId = r.id || r.reportId
        const id = `report-${reportId}`
        return {
          id,
          title: `Báo cáo vi phạm: ${r.reason || 'Nội dung bất thường'}`,
          message: `${r.description || `Khiếu nại đối tượng ${r.targetType} #${String(r.targetId || '').substring(0, 8)}...`}`,
          type: 'REPORT',
          targetType: r.targetType,
          targetId: r.targetId,
          createdAt: r.createdAt || new Date().toISOString(),
          isRead: readIds.has(id),
          link: `/reports?reportId=${reportId}`,
        }
      })

      // 2. Try fetching in-app notifications from notification-service if available
      let inAppNotifications: AdminNotification[] = []
      try {
        const notifRes = await api.get('/api/v1/notifications?page=1&size=10')
        const rawNotifs = notifRes.data
        const notifsList: any[] = Array.isArray(rawNotifs)
          ? rawNotifs
          : Array.isArray(rawNotifs?.data)
          ? rawNotifs.data
          : []

        inAppNotifications = notifsList.map((n: any) => {
          const id = String(n.id || n.notificationId)
          return {
            id,
            title: n.title || 'Thông báo hệ thống',
            message: n.content || n.message || '',
            type: n.type || 'SYSTEM',
            targetType: n.targetType,
            targetId: n.targetId,
            createdAt: n.createdAt || new Date().toISOString(),
            isRead: readIds.has(id) || Boolean(n.isRead || n.read),
            link: n.link || '/reports',
          }
        })
      } catch {
        // Fallback gracefully if user notifications are not accessible
      }

      // Combine and sort by createdAt descending
      const all = [...reportNotifications, ...inAppNotifications]
      all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return all
    } catch (err) {
      console.warn('Failed to fetch admin notifications:', err)
      return []
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const notifs = await notificationService.getNotifications()
      return notifs.filter((n) => !n.isRead).length
    } catch {
      return 0
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    const readIds = getReadIds()
    readIds.add(id)
    saveReadIds(readIds)

    if (!id.startsWith('report-')) {
      try {
        await api.put(`/api/v1/notifications/${id}/read`)
      } catch {
        // ignore
      }
    }
  },

  markAllAsRead: async (notificationIds?: string[]): Promise<void> => {
    const readIds = getReadIds()
    if (notificationIds && notificationIds.length > 0) {
      notificationIds.forEach((id) => readIds.add(id))
    } else {
      const current = await notificationService.getNotifications()
      current.forEach((n) => readIds.add(n.id))
    }
    saveReadIds(readIds)

    try {
      await api.put('/api/v1/notifications/read-all')
    } catch {
      // ignore
    }
  },
}

export default notificationService
