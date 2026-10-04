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
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#242526] p-4 rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs">
      {/* Filter by Target Type */}
      <select
        value={filter.targetType || 'ALL'}
        onChange={(e) => onChange({ targetType: e.target.value as any, page: 1 })}
        className="bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] px-3.5 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:border-[#0866FF] transition-all cursor-pointer"
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
        className="bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] px-3.5 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:border-[#0866FF] transition-all cursor-pointer"
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

