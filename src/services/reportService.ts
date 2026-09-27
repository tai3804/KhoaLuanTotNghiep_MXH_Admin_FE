import api from './api'
import { Report, ResolveReportPayload } from '../types/report'

export const reportService = {
  getAllReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get('/api/v1/moderation/reports?size=100')
      const rawData = response.data
      const reportsList: any[] = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : rawData?.data && Array.isArray(rawData.data.content)
        ? rawData.data.content
        : []

      return reportsList.map((r) => ({
        id: r.id || r.reportId,
        targetType: r.targetType || 'POST',
        targetId: String(r.targetId || ''),
        reason: r.reason || 'Khác',
        description: r.description || r.details || '',
        reporterId: r.reporterId,
        reporter: r.reporter || {
          id: r.reporterId || 'anon',
          username: r.reporterUsername || 'reporter',
          fullName: r.reporterName || 'Người dùng',
          avatarUrl: r.reporterAvatarUrl,
        },
        status: r.status || 'PENDING',
        createdAt: r.createdAt || new Date().toISOString(),
        resolvedAt: r.resolvedAt,
        resolvedBy: r.resolvedBy,
        resolutionNotes: r.resolutionNotes,
        targetData: r.targetData,
      }))
    } catch (err) {
      console.warn('Failed to fetch all reports:', err)
      return []
    }
  },

  getPendingReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get('/api/v1/moderation/reports?status=PENDING&size=100')
      const rawData = response.data
      const reportsList: any[] = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : rawData?.data && Array.isArray(rawData.data.content)
        ? rawData.data.content
        : []

      return reportsList.map((r) => ({
        id: r.id || r.reportId,
        targetType: r.targetType || 'POST',
        targetId: String(r.targetId || ''),
        reason: r.reason || 'Khác',
        description: r.description || r.details || '',
        reporterId: r.reporterId,
        reporter: r.reporter || {
          id: r.reporterId || 'anon',
          username: r.reporterUsername || 'reporter',
          fullName: r.reporterName || 'Người dùng',
          avatarUrl: r.reporterAvatarUrl,
        },
        status: r.status || 'PENDING',
        createdAt: r.createdAt || new Date().toISOString(),
        resolvedAt: r.resolvedAt,
        resolvedBy: r.resolvedBy,
        resolutionNotes: r.resolutionNotes,
        targetData: r.targetData,
      }))
    } catch (err) {
      console.warn('Failed to fetch pending reports:', err)
      return []
    }
  },

  getReportById: async (id: string | number): Promise<Report | null> => {
    try {
      const response = await api.get(`/api/v1/moderation/reports/${id}`)
      const r = response.data?.data || response.data
      if (!r) return null
      return {
        id: r.id || r.reportId,
        targetType: r.targetType || 'POST',
        targetId: String(r.targetId || ''),
        reason: r.reason || 'Khác',
        description: r.description || r.details || '',
        reporterId: r.reporterId,
        reporter: r.reporter || {
          id: r.reporterId || 'anon',
          username: r.reporterUsername || 'reporter',
          fullName: r.reporterName || 'Người dùng',
          avatarUrl: r.reporterAvatarUrl,
        },
        status: r.status || 'PENDING',
        createdAt: r.createdAt || new Date().toISOString(),
        resolvedAt: r.resolvedAt,
        resolvedBy: r.resolvedBy,
        resolutionNotes: r.resolutionNotes,
        targetData: r.targetData,
      }
    } catch (err) {
      console.warn(`Failed to fetch report #${id}:`, err)
      return null
    }
  },

  resolveReport: async (payload: ResolveReportPayload): Promise<void> => {
    await api.post(`/api/v1/moderation/reports/${payload.reportId}/process`, {
      action: payload.deleteTarget ? 'DELETE_POST' : 'DISMISS',
      reason: payload.deleteTarget ? 'VIOLATION' : 'NO_VIOLATION',
      note: 'Admin resolved manually'
    })
  },

  getTargetDetail: async (type: string, targetId: string): Promise<any> => {
    try {
      if (type === 'POST') {
        const postRes = await api.get(`/api/v1/posts/${targetId}`)
        const postData = postRes.data?.data || postRes.data
        if (!postData) return null

        let authorData = null
        if (postData.authorId) {
          try {
            const userRes = await api.get(`/api/v1/users/profile/${postData.authorId}`)
            authorData = userRes.data?.data || userRes.data
          } catch {
            // ignore if user profile fetch fails
          }
        }

        const mediaList = Array.isArray(postData.mediaList)
          ? postData.mediaList.map((m: any) => m.mediaUrl || m.url || m)
          : Array.isArray(postData.media)
          ? postData.media.map((m: any) => m.mediaUrl || m.url || m)
          : Array.isArray(postData.mediaUrls)
          ? postData.mediaUrls
          : []

        return {
          id: postData.id,
          content: postData.content || '',
          privacy: postData.privacy || 'PUBLIC',
          status: postData.status || 'ACTIVE',
          likeCount: postData.likeCount ?? 0,
          commentCount: postData.commentCount ?? 0,
          shareCount: postData.shareCount ?? 0,
          mediaUrls: mediaList,
          createdAt: postData.createdAt,
          author: authorData
            ? {
                id: authorData.id || authorData.userId || postData.authorId,
                fullName:
                  authorData.fullName ||
                  `${authorData.firstName || ''} ${authorData.lastName || ''}`.trim() ||
                  authorData.username ||
                  'Thành viên',
                username: authorData.username || 'user',
                avatarUrl: authorData.avatarUrl,
              }
            : {
                id: postData.authorId,
                fullName: 'Thành viên #' + String(postData.authorId).substring(0, 8),
                username: 'user',
                avatarUrl: undefined,
              },
        }
      }

      if (type === 'USER') {
        const userRes = await api.get(`/api/v1/users/profile/${targetId}`)
        const userData = userRes.data?.data || userRes.data
        if (!userData) return null

        return {
          id: userData.id || userData.userId || targetId,
          fullName:
            userData.fullName ||
            `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
            userData.username ||
            'Người dùng',
          username: userData.username || 'user',
          avatarUrl: userData.avatarUrl,
          coverUrl: userData.coverUrl,
          bio: userData.bio,
          gender: userData.gender,
          createdAt: userData.createdAt,
        }
      }

      return null
    } catch (err) {
      console.warn(`Failed to fetch target details for ${type} #${targetId}:`, err)
      return null
    }
  },
}
