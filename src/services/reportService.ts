import api from './api'
import { Report, ResolveReportPayload } from '../types/report'

export const reportService = {
  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get('/api/v1/admin/reports')
    const rawData = response.data
    const reportsList: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return reportsList.map((r) => ({
      id: r.id,
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
  },

  getPendingReports: async (): Promise<Report[]> => {
    const response = await api.get('/api/v1/admin/reports/pending')
    const rawData = response.data
    const reportsList: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return reportsList.map((r) => ({
      id: r.id,
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
  },

  resolveReport: async (payload: ResolveReportPayload): Promise<void> => {
    await api.put(`/api/v1/admin/reports/${payload.reportId}/resolve`, null, {
      params: {
        deleteTarget: payload.deleteTarget,
      },
    })
  },

  getTargetDetail: async (type: string, targetId: string): Promise<any> => {
    const response = await api.get(`/api/v1/admin/reports/target/${type}/${targetId}`)
    return response.data
  },
}
