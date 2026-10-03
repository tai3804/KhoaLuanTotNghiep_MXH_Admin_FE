export interface AiModerationLog {
  id: string
  targetType: 'POST' | 'COMMENT' | 'USER' | string
  targetId: string
  authorId?: string
  reportId?: string
  contentSnippet: string
  toxicityScore: number
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string
  actionTaken: 'ALLOW' | 'WARN_USER' | 'AUTO_HIDE' | 'DELETE_POST' | string
  reason: string
  extractedKeywords?: string
  isFallback: boolean
  createdAt: string
}

export interface AiStats {
  totalEvaluations: number
  totalFlagged: number
  totalKeywords: number
  autoLearnedKeywords: number
}

export interface SensitiveKeyword {
  id: string
  keyword: string
  category: string
  severity: string
  hitCount: number
  isAutoLearned: boolean
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_REVIEW' | string
  confidenceScore: number
  lastTriggeredAt?: string
  createdAt: string
}

export interface GeminiModerationResult {
  isToxic: boolean
  toxicityScore: number
  category: string
  severity: string
  suggestedAction: string
  reason: string
  extractedKeywords: string[]
  isFallback: boolean
}
