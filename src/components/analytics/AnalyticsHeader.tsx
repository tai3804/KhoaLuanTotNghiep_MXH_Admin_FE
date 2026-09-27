import React from 'react'
import { TrendingUp, RefreshCw, FileDown } from 'lucide-react'
import Button from '../common/Button'
import { TimeRange } from '../../types/analytics'

interface AnalyticsHeaderProps {
  selectedTimeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  onRefresh: () => void
  onOpenExport: () => void
  isLoading?: boolean
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedTimeRange,
  onTimeRangeChange,
  onRefresh,
  onOpenExport,
  isLoading = false,
}) => {
  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: '24h', label: '24 Giờ qua' },
    { id: '7d', label: '7 Ngày gần nhất' },
    { id: '30d', label: '30 Ngày qua' },
    { id: 'quarter', label: 'Quý này' },
  ]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#1877f2] to-violet-600 flex items-center justify-center text-white shadow-md shadow-[#1877f2]/25">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Phân Tích Nâng Cao & Xu Hướng Mạng Xã Hội
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bản đồ nhiệt hoạt động, hashtag thịnh hành, phân bổ thiết bị và khung giờ vàng
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Time range pills */}
        <div className="p-1 bg-slate-100 dark:bg-[#18191a] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => onTimeRangeChange(range.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedTimeRange === range.id
                  ? 'bg-white dark:bg-[#242526] text-[#1877f2] dark:text-[#2d88ff] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          title="Làm mới số liệu"
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Làm mới
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenExport}
          leftIcon={<FileDown className="w-4 h-4" />}
        >
          Xuất Báo Cáo
        </Button>
      </div>
    </div>
  )
}

export default AnalyticsHeader
