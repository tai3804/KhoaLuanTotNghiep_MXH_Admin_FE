import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Eye, User, FileText, MessageSquare, Users2, Calendar, Clock } from 'lucide-react'
import { Report } from '../../types/report'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Pagination from '../common/Pagination'

interface ReportSearchResultListProps {
  reports: Report[]
}

export const ReportSearchResultList: React.FC<ReportSearchResultListProps> = ({ reports }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [reports.length])

  const paginatedReports = reports.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="danger" size="sm">Chờ xử lý</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="warning" size="sm">Đang xử lý</Badge>
      case 'RESOLVED':
        return <Badge variant="success" size="sm">Đã giải quyết</Badge>
      case 'DISMISSED':
        return <Badge variant="neutral" size="sm">Đã bác bỏ</Badge>
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>
    }
  }

  const getTargetTypeIcon = (type: string) => {
    switch (type) {
      case 'POST':
        return <FileText className="w-3.5 h-3.5 text-emerald-500" />
      case 'USER':
        return <User className="w-3.5 h-3.5 text-indigo-500" />
      case 'COMMENT':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
      case 'GROUP':
        return <Users2 className="w-3.5 h-3.5 text-cyan-500" />
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#393a3b] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#393a3b] bg-slate-50/75 dark:bg-[#1c1e21]/75 text-[11px] font-bold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider">
                <th className="py-3 px-4">Mã / Lý do vi phạm</th>
                <th className="py-3 px-4">Đối tượng bị báo cáo</th>
                <th className="py-3 px-4">Người báo cáo</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#393a3b]/60 text-xs">
              {paginatedReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#3a3b3c]/40 transition-colors"
                >
                  {/* Reason & ID */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[11px] text-slate-400 font-semibold">
                          #{report.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          {report.reason}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-[#b0b3b8] line-clamp-1">
                        {report.description || 'Không có mô tả chi tiết'}
                      </p>
                    </div>
                  </td>

                  {/* Target Entity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-[#e4e6eb]">
                      {getTargetTypeIcon(report.targetType)}
                      <span className="font-semibold">{report.targetType}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({report.targetId?.slice(0, 10)}...)
                      </span>
                    </div>
                  </td>

                  {/* Reporter */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={report.reporter?.avatarUrl}
                        name={report.reporter?.fullName || report.reporter?.username || 'Reporter'}
                        size="xs"
                        shape="circle"
                      />
                      <span className="text-xs text-slate-800 dark:text-[#e4e6eb] font-medium truncate max-w-32">
                        {report.reporter?.fullName || report.reporter?.username || report.reporterId || 'Hệ thống'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {getStatusBadge(report.status)}
                  </td>

                  {/* Time */}
                  <td className="py-3 px-4 text-slate-500 dark:text-[#b0b3b8]">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate('/reports')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-colors cursor-pointer"
                      title="Chuyển đến trang Kiểm duyệt Báo cáo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Kiểm duyệt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {reports.length > 0 && (
          <div className="border-t border-slate-200 dark:border-[#393a3b] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#b0b3b8]">
              <span>Hiển thị mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-slate-50 dark:bg-[#18191a] text-slate-800 dark:text-[#e4e6eb] text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-[#393a3b] cursor-pointer"
              >
                <option value={5}>5 báo cáo</option>
                <option value={10}>10 báo cáo</option>
                <option value={20}>20 báo cáo</option>
                <option value={50}>50 báo cáo</option>
              </select>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={reports.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportSearchResultList
