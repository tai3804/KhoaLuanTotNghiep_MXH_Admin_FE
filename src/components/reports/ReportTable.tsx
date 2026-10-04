import React from 'react'
import { Report } from '../../types/report'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import { userProfileCache } from '../../services/userService'

export interface ReportTableProps {
  reports: Report[]
  isLoading?: boolean
  onResolveClick: (report: Report) => void
  highlightId?: string | number
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  isLoading,
  onResolveClick,
  highlightId,
}) => {
  const columns: Column<Report>[] = [
    {
      header: 'Mã Báo Cáo',
      cell: (report) => (
        <span className="font-mono text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
          #{report.id}
        </span>
      ),
    },
    {
      header: 'Đối Tượng',
      cell: (report) => {
        if (report.targetType === 'USER') {
          const targetUser = userProfileCache[report.targetId]
          return (
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm">
                USER
              </Badge>
              {targetUser ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Avatar
                    src={targetUser.avatarUrl}
                    name={targetUser.fullName}
                    size="xs"
                    shape="rounded"
                  />
                  <span className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] max-w-[130px] truncate">
                    {targetUser.fullName}
                  </span>
                </div>
              ) : (
                <span className="font-mono text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  {report.targetId}
                </span>
              )}
            </div>
          )
        }

        const variant = report.targetType === 'POST' ? 'primary' : 'neutral'
        return (
          <div className="flex items-center gap-2">
            <Badge variant={variant} size="sm">
              {report.targetType}
            </Badge>
            <span className="font-mono text-xs text-[#65676B] dark:text-[#B0B3B8]">
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
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1 max-w-xs truncate">
              {report.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Người Báo Cáo',
      cell: (report) => (
        <div className="flex items-center gap-2.5">
          <Avatar
            src={report.reporter?.avatarUrl}
            name={report.reporter?.fullName || report.reporter?.username || 'Người dùng'}
            size="sm"
            shape="rounded"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
              {report.reporter?.fullName || report.reporterId || 'Ẩn danh'}
            </span>
            {report.reporter?.username && (
              <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] truncate">
                @{report.reporter.username}
              </span>
            )}
          </div>
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
        <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
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
            {report.status === 'PENDING' ? 'Xem & Xử Lý' : 'Xem Lại'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={reports}
      isLoading={isLoading}
      highlightId={highlightId}
    />
  )
}

export default ReportTable

