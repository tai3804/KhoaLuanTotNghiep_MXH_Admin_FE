import React from 'react'
import { ReportFilter } from '../../types/report'

export interface ReportFilterBarProps {
  filter: ReportFilter
  onChange: (filter: Partial<ReportFilter>) => void
}

export const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  filter,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#242526] p-4 rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs">
      {/* Filter by Target Type */}
      <select
        value={filter.targetType || 'ALL'}
        onChange={(e) => onChange({ targetType: e.target.value as any, page: 1 })}
        className="bg-slate-50 dark:bg-[#3a3b3c]/50 text-xs text-slate-700 dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#1877f2]"
      >
        <option value="ALL">Mọi đối tượng báo cáo</option>
        <option value="POST">Báo cáo Bài viết (POST)</option>
        <option value="COMMENT">Báo cáo Bình luận (COMMENT)</option>
        <option value="USER">Báo cáo Người dùng (USER)</option>
        <option value="GROUP">Báo cáo Hội nhóm (GROUP)</option>
      </select>

      {/* Filter by Status */}
      <select
        value={filter.status || 'ALL'}
        onChange={(e) => onChange({ status: e.target.value as any, page: 1 })}
        className="bg-slate-50 dark:bg-[#3a3b3c]/50 text-xs text-slate-700 dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#1877f2]"
      >
        <option value="ALL">Mọi trạng thái</option>
        <option value="PENDING">Chờ xử lý (Pending)</option>
        <option value="RESOLVED">Đã giải quyết (Resolved)</option>
        <option value="DISMISSED">Bác bỏ (Dismissed)</option>
      </select>
    </div>
  )
}

export default ReportFilterBar
