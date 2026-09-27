import React from 'react'
import { Search, Filter, Layers } from 'lucide-react'

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          placeholder="Tìm theo Admin, Hành động, Chi tiết..."
          className="w-full bg-slate-50 dark:bg-[#1c1e21] text-xs text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-[#1877f2] transition-colors"
        />
      </div>

      {/* Filter by Action */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Hành động:</span>
        </div>
        <select
          value={filter.action}
          onChange={(e) => onChange({ ...filter, action: e.target.value })}
          className="bg-slate-50 dark:bg-[#1c1e21] text-xs text-slate-900 dark:text-white px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-[#1877f2] cursor-pointer"
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
