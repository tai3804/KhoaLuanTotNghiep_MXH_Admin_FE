import api from './api'
import { Report, ResolveReportPayload } from '../types/report'
import { userService, userProfileCache, formatVietnameseName } from './userService'

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

      // Extract unique reporter IDs & target user IDs to pre-fetch profiles
      const userIds = Array.from(
        new Set(
          reportsList
            .flatMap((r) => [
              r.reporterId ? String(r.reporterId) : null,
              r.targetType === 'USER' && r.targetId ? String(r.targetId) : null,
            ])
            .filter((id): id is string => Boolean(id && id !== 'anon' && id !== 'unknown'))
        )
      )

      if (userIds.length > 0) {
        await Promise.allSettled(userIds.map((id) => userService.fetchUserProfile(id)))
      }

      return reportsList.map((r) => {
        const reporterId = r.reporterId ? String(r.reporterId) : ''
        const cachedReporter = reporterId ? userProfileCache[reporterId] : null

        return {
          id: r.id || r.reportId,
          targetType: r.targetType || 'POST',
          targetId: String(r.targetId || ''),
          reason: r.reason || 'Khác',
          description: r.description || r.details || '',
          reporterId: r.reporterId,
          reporter: {
            id: reporterId || 'anon',
            username: cachedReporter?.username || r.reporter?.username || r.reporterUsername || 'reporter',
            fullName: cachedReporter?.fullName || r.reporter?.fullName || r.reporterName || 'Người dùng',
            avatarUrl: cachedReporter?.avatarUrl || r.reporter?.avatarUrl || r.reporterAvatarUrl,
          },
          status: r.status || 'PENDING',
          createdAt: r.createdAt || new Date().toISOString(),
          resolvedAt: r.resolvedAt,
          resolvedBy: r.resolvedBy,
          resolutionNotes: r.resolutionNotes,
          targetData: r.targetData,
        }
      })
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

      const userIds = Array.from(
        new Set(
          reportsList
            .flatMap((r) => [
              r.reporterId ? String(r.reporterId) : null,
              r.targetType === 'USER' && r.targetId ? String(r.targetId) : null,
            ])
            .filter((id): id is string => Boolean(id && id !== 'anon' && id !== 'unknown'))
        )
      )

      if (userIds.length > 0) {
        await Promise.allSettled(userIds.map((id) => userService.fetchUserProfile(id)))
      }

      return reportsList.map((r) => {
        const reporterId = r.reporterId ? String(r.reporterId) : ''
        const cachedReporter = reporterId ? userProfileCache[reporterId] : null

        return {
          id: r.id || r.reportId,
          targetType: r.targetType || 'POST',
          targetId: String(r.targetId || ''),
          reason: r.reason || 'Khác',
          description: r.description || r.details || '',
          reporterId: r.reporterId,
          reporter: {
            id: reporterId || 'anon',
            username: cachedReporter?.username || r.reporter?.username || r.reporterUsername || 'reporter',
            fullName: cachedReporter?.fullName || r.reporter?.fullName || r.reporterName || 'Người dùng',
            avatarUrl: cachedReporter?.avatarUrl || r.reporter?.avatarUrl || r.reporterAvatarUrl,
          },
          status: r.status || 'PENDING',
          createdAt: r.createdAt || new Date().toISOString(),
          resolvedAt: r.resolvedAt,
          resolvedBy: r.resolvedBy,
          resolutionNotes: r.resolutionNotes,
          targetData: r.targetData,
        }
      })
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

      const reporterId = r.reporterId ? String(r.reporterId) : ''
      let cachedReporter = reporterId ? userProfileCache[reporterId] : null
      if (!cachedReporter && reporterId) {
        cachedReporter = await userService.fetchUserProfile(reporterId)
      }

      return {
        id: r.id || r.reportId,
        targetType: r.targetType || 'POST',
        targetId: String(r.targetId || ''),
        reason: r.reason || 'Khác',
        description: r.description || r.details || '',
        reporterId: r.reporterId,
        reporter: {
          id: reporterId || 'anon',
          username: cachedReporter?.username || r.reporter?.username || r.reporterUsername || 'reporter',
          fullName: cachedReporter?.fullName || r.reporter?.fullName || r.reporterName || 'Người dùng',
          avatarUrl: cachedReporter?.avatarUrl || r.reporter?.avatarUrl || r.reporterAvatarUrl,
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
                fullName: formatVietnameseName(authorData),
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
          fullName: formatVietnameseName(userData),
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
