import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { Report } from '../../types/report'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'
import Button from '../common/Button'

export interface ReportTableProps {
  reports: Report[]
  isLoading?: boolean
  onResolveClick: (report: Report) => void
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  isLoading,
  onResolveClick,
}) => {
  const columns: Column<Report>[] = [
    {
      header: 'Mã Báo Cáo',
      cell: (report) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          #{report.id}
        </span>
      ),
    },
    {
      header: 'Đối Tượng',
      cell: (report) => {
        const variant =
          report.targetType === 'POST'
            ? 'primary'
            : report.targetType === 'USER'
            ? 'warning'
            : 'neutral'
        return (
          <div className="flex items-center gap-2">
            <Badge variant={variant} size="sm">
              {report.targetType}
            </Badge>
            <span className="font-mono text-xs text-slate-400">
              {report.targetId}
            </span>
          </div>
        )
      },
    },
    {
      header: 'Lý Do Vi Phạm',
      cell: (report) => (
        <div>
          <Badge variant="danger" size="sm">
            {report.reason}
          </Badge>
          {report.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs truncate">
              {report.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Người Báo Cáo',
      cell: (report) => (
        <div className="flex items-center gap-2">
          {report.reporter?.avatarUrl && (
            <img
              src={report.reporter.avatarUrl}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="text-xs text-slate-700 dark:text-slate-300">
            {report.reporter?.fullName || report.reporterId || 'Ẩn danh'}
          </span>
        </div>
      ),
    },
    {
      header: 'Trạng Thái',
      cell: (report) => {
        const variant =
          report.status === 'PENDING'
            ? 'warning'
            : report.status === 'RESOLVED'
            ? 'success'
            : 'neutral'
        return (
          <Badge variant={variant} size="sm" dot>
            {report.status}
          </Badge>
        )
      },
    },
    {
      header: 'Thời Gian',
      cell: (report) => (
        <span className="text-xs text-slate-400">
          {report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : 'Mới'}
        </span>
      ),
    },
    {
      header: 'Hành Động',
      className: 'text-right',
      cell: (report) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant={report.status === 'PENDING' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onResolveClick(report)}
          >
            {report.status === 'PENDING' ? 'Xử Lý' : 'Xem Lại'}
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={reports} isLoading={isLoading} />
}

export default ReportTable
