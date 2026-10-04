import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Eye, User, FileText, MessageSquare, Users2, Clock } from 'lucide-react'
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
        return <FileText className="w-3.5 h-3.5 text-[#31A24C]" />
      case 'USER':
        return <User className="w-3.5 h-3.5 text-[#0866FF]" />
      case 'COMMENT':
        return <MessageSquare className="w-3.5 h-3.5 text-[#0866FF]" />
      case 'GROUP':
        return <Users2 className="w-3.5 h-3.5 text-cyan-500" />
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-[#65676B]" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5]/80 dark:bg-[#18191A]/80 text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
                <th className="py-3 px-4">Mã / Lý do vi phạm</th>
                <th className="py-3 px-4">Đối tượng bị báo cáo</th>
                <th className="py-3 px-4">Người báo cáo</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E6EB] dark:divide-[#393A3B] text-xs">
              {paginatedReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-[#F0F2F5]/70 dark:hover:bg-[#3A3B3C]/40 transition-colors"
                >
                  {/* Reason & ID */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[11px] text-[#65676B] dark:text-[#B0B3B8] font-semibold">
                          #{report.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-500/10 text-[#FA383E]">
                          {report.reason}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] line-clamp-1">
                        {report.description || 'Không có mô tả chi tiết'}
                      </p>
                    </div>
                  </td>

                  {/* Target Entity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#050505] dark:text-[#E4E6EB]">
                      {getTargetTypeIcon(report.targetType)}
                      <span className="font-semibold">{report.targetType}</span>
                      <span className="text-[#65676B] dark:text-[#B0B3B8] font-mono text-[11px]">
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
                      <span className="text-xs text-[#050505] dark:text-[#E4E6EB] font-medium truncate max-w-32">
                        {report.reporter?.fullName || report.reporter?.username || report.reporterId || 'Hệ thống'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {getStatusBadge(report.status)}
                  </td>

                  {/* Time */}
                  <td className="py-3 px-4 text-[#65676B] dark:text-[#B0B3B8]">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-[#65676B] dark:text-[#B0B3B8]" />
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FA383E] bg-rose-50 dark:bg-rose-500/10 hover:bg-[#FA383E] hover:text-white dark:hover:bg-[#FA383E] dark:hover:text-white transition-colors cursor-pointer"
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
          <div className="border-t border-[#E4E6EB] dark:border-[#393A3B] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#65676B] dark:text-[#B0B3B8]">
              <span>Hiển thị mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-[#F0F2F5] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB] text-xs font-semibold px-2 py-1 rounded-lg border border-[#E4E6EB] dark:border-[#393A3B] cursor-pointer"
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

