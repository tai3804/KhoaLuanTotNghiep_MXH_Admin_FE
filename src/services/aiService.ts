import api from './api'
import {
  AiModerationLog,
  AiStats,
  SensitiveKeyword,
  GeminiModerationResult,
} from '../types/ai'

export const aiService = {
  getStats: async (): Promise<AiStats> => {
    const res = await api.get('/api/v1/ai/moderation/stats')
    const raw = res.data?.data || res.data || {}
    return {
      totalEvaluations: Number(raw.totalEvaluations || 0),
      totalFlagged: Number(raw.totalFlagged || 0),
      totalKeywords: Number(raw.totalKeywords || 0),
      autoLearnedKeywords: Number(raw.autoLearnedKeywords || 0),
    }
  },

  getLogs: async (page = 0, size = 20): Promise<{ content: AiModerationLog[]; totalElements: number; totalPages: number }> => {
    const res = await api.get('/api/v1/ai/moderation/logs', {
      params: { page, size },
    })
    const payload = res.data
    const content: AiModerationLog[] = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
      ? payload.content
      : []

    return {
      content,
      totalElements: Number(payload?.totalElements || content.length),
      totalPages: Number(payload?.totalPages || 1),
    }
  },

  getKeywords: async (params?: {
    keyword?: string
    category?: string
    status?: string
    page?: number
    size?: number
  }): Promise<{ content: SensitiveKeyword[]; totalElements: number; totalPages: number }> => {
    const res = await api.get('/api/v1/ai/keywords', { params })
    const payload = res.data
    const content: SensitiveKeyword[] = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
      ? payload.content
      : []

    return {
      content,
      totalElements: Number(payload?.totalElements || content.length),
      totalPages: Number(payload?.totalPages || 1),
    }
  },

  approveKeyword: async (id: string): Promise<void> => {
    await api.post(`/api/v1/ai/keywords/${id}/approve`)
  },

  addKeyword: async (data: { keyword: string; category?: string; severity?: string }): Promise<void> => {
    await api.post('/api/v1/ai/keywords', data)
  },

  evaluateContent: async (content: string): Promise<GeminiModerationResult> => {
    const res = await api.post('/api/v1/ai/moderation/evaluate', { content })
    return res.data?.data || res.data
  },
}
