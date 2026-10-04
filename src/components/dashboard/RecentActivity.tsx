import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Report } from '../../types/report'
import Badge from '../common/Badge'

export interface RecentActivityProps {
  reports: Report[]
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ reports }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
            Báo Cáo Vi Phạm Mới Nhất
          </h3>
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
            Các nội dung cần Ban Quản trị xử lý nhanh
          </p>
        </div>

        <Link
          to="/reports"
          className="flex items-center gap-1 text-xs font-bold text-[#0866ff] dark:text-[#2d88ff] hover:underline"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-[#65676b] dark:text-[#b0b3b8] gap-2">
          <ShieldCheck className="w-8 h-8 text-[#31a24c]/50" />
          <span className="text-xs font-medium">Hiện tại không có báo cáo vi phạm nào cần xử lý</span>
        </div>
      ) : (
        <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
          {reports.slice(0, 4).map((report) => (
            <div
              key={report.id}
              className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-2xl bg-[#ffebe8] text-[#fa383e] dark:bg-[#fa383e]/20 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
                      Báo cáo {report.targetType} #{report.id}
                    </span>
                    <Badge
                      variant={report.status === 'PENDING' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
                    Lý do: <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">{report.reason}</span> {report.description ? `- ${report.description}` : ''}
                  </p>
                </div>
              </div>

              <Link
                to="/reports"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0866ff] dark:text-[#2d88ff] bg-[#e7f3ff] hover:bg-[#d5e9ff] dark:bg-[#0866ff]/20 dark:hover:bg-[#0866ff]/30 shrink-0 transition-colors"
              >
                Kiểm tra
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentActivity


