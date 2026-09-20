import React from 'react'
import { History, Shield } from 'lucide-react'
import { AuditLog } from '../../types/settings'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'

export interface AuditLogViewerProps {
  logs: AuditLog[]
  isLoading?: boolean
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  isLoading = false,
}) => {
  const columns: Column<AuditLog>[] = [
    {
      header: 'Thời Gian',
      cell: (log) => (
        <span className="text-xs font-mono text-slate-500">
          {new Date(log.createdAt).toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      header: 'Quản Trị Viên',
      cell: (log) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            @{log.adminUsername}
          </span>
        </div>
      ),
    },
    {
      header: 'Hành Động',
      cell: (log) => {
        const variant =
          log.action.includes('BAN') || log.action.includes('DELETE')
            ? 'danger'
            : log.action.includes('RESOLVE')
            ? 'success'
            : 'primary'
        return (
          <Badge variant={variant} size="sm">
            {log.action}
          </Badge>
        )
      },
    },
    {
      header: 'Đối Tượng Mục Tiêu',
      cell: (log) => (
        <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
          {log.targetType} ({log.targetId})
        </span>
      ),
    },
    {
      header: 'Chi Tiết Thao Tác',
      cell: (log) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 max-w-sm truncate block">
          {log.details || 'Không có mô tả thêm'}
        </span>
      ),
    },
    {
      header: 'IP Address',
      cell: (log) => (
        <span className="text-xs font-mono text-slate-400">
          {log.ipAddress || '127.0.0.1'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-900 dark:text-[#e4e6eb]">
        <History className="w-5 h-5 text-[#1877f2]" />
        <div>
          <h3 className="text-base font-bold">Nhật Ký Hoạt Động (Audit Logs)</h3>
          <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">
            Theo dõi và ghi nhận mọi hành động nhạy cảm của Ban Quản trị
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={logs} isLoading={isLoading} />
    </div>
  )
}

export default AuditLogViewer
