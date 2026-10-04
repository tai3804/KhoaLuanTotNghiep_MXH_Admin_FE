import React from 'react'
import { Search, Filter } from 'lucide-react'

export interface AuditLogFilter {
  search: string
  action: string
  targetType: string
}

interface AuditLogFilterBarProps {
  filter: AuditLogFilter
  onChange: (newFilter: AuditLogFilter) => void
  actionsList: string[]
}

export const AuditLogFilterBar: React.FC<AuditLogFilterBarProps> = ({
  filter,
  onChange,
  actionsList,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-[#65676B] dark:text-[#B0B3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          placeholder="Tìm theo Admin, Hành động, Chi tiết..."
          className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 focus:border-[#0866FF] transition-colors"
        />
      </div>

      {/* Filter by Action */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <div className="flex items-center gap-1 text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Hành động:</span>
        </div>
        <select
          value={filter.action}
          onChange={(e) => onChange({ ...filter, action: e.target.value })}
          className="bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs font-medium text-[#050505] dark:text-[#E4E6EB] px-3.5 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 cursor-pointer"
        >
          <option value="ALL">Tất cả hành động</option>
          {actionsList.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AuditLogFilterBar
