export type ReportTargetType = 'POST' | 'COMMENT' | 'USER' | 'GROUP'
export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED'

export type ReportReason =
  | 'SPAM'
  | 'HATE_SPEECH'
  | 'HARASSMENT'
  | 'NUDITY_OR_SEXUAL'
  | 'VIOLENCE'
  | 'FALSE_INFORMATION'
  | 'SCAM_OR_FRAUD'
  | 'OTHER'

export interface ReportReporter {
  id: string
  username: string
  fullName: string
  avatarUrl?: string
}

export interface Report {
  id: string | number
  targetType: ReportTargetType
  targetId: string
  reason: ReportReason | string
  description?: string
  reporter?: ReportReporter
  reporterId?: string
  status: ReportStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNotes?: string
  targetData?: any // Populated snapshot or preview of reported content
}

export interface ReportFilter {
  targetType?: ReportTargetType | 'ALL'
  status?: ReportStatus | 'ALL'
  reason?: string
  page: number
  limit: number
}

export interface ResolveReportPayload {
  reportId: string | number
  deleteTarget: boolean
  action: 'DELETE_AND_RESOLVE' | 'WARN_USER' | 'BAN_USER' | 'DISMISS'
  notes?: string
}
