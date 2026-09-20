export interface BlacklistedWord {
  id: number | string
  word: string
  category?: string
  severity?: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt?: string
}

export interface AuditLog {
  id: number | string
  adminId: string
  adminUsername: string
  action: string
  targetType: string
  targetId: string
  details?: string
  ipAddress?: string
  createdAt: string
}

export interface ServiceHealth {
  name: string
  port: number
  status: 'UP' | 'DOWN' | 'WARNING'
  responseTimeMs?: number
  lastChecked?: string
}
