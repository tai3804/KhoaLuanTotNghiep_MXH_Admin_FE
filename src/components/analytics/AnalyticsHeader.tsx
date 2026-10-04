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
          <div className="w-9 h-9 rounded-full bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#050505] dark:text-[#E4E6EB] tracking-tight">
              Phân Tích Nâng Cao & Xu Hướng Mạng Xã Hội
            </h2>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
              Bản đồ nhiệt hoạt động, hashtag thịnh hành, phân bổ thiết bị và khung giờ vàng
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Time range pills */}
        <div className="p-1 bg-[#F0F2F5] dark:bg-[#18191A] rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] flex items-center gap-1 text-xs">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => onTimeRangeChange(range.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedTimeRange === range.id
                  ? 'bg-white dark:bg-[#242526] text-[#0866FF] dark:text-[#2D88FF] shadow-xs font-bold'
                  : 'text-[#65676B] dark:text-[#B0B3B8] hover:text-[#050505] dark:hover:text-[#E4E6EB]'
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

