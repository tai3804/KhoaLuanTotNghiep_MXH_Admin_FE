import React, { useState } from 'react'
import { Flame, Clock, Sparkles, Calendar, Zap } from 'lucide-react'
import { ActivityHeatmapData } from '../../types/analytics'

interface ActivityHeatmapProps {
  data: ActivityHeatmapData | null
  isLoading?: boolean
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  isLoading = false,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    day: string
    hour: number
    value: number
  } | null>(null)

  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-md w-1/3" />
        <div className="h-64 bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 rounded-xl" />
      </div>
    )
  }

  // Calculate max value in matrix for relative color scaling
  const maxVal = Math.max(
    ...data.matrix.flatMap((row) => row),
    1
  )

  const getCellColor = (val: number) => {
    const ratio = val / maxVal
    if (ratio < 0.15) {
      return 'bg-[#F0F2F5] dark:bg-[#18191A] text-[#65676B] dark:text-[#B0B3B8] hover:ring-2 hover:ring-[#CED0D4]'
    }
    if (ratio < 0.35) {
      return 'bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] hover:ring-2 hover:ring-[#0866FF]/40'
    }
    if (ratio < 0.6) {
      return 'bg-[#0866FF]/40 text-[#050505] dark:text-white hover:ring-2 hover:ring-[#0866FF]/60'
    }
    if (ratio < 0.8) {
      return 'bg-[#0866FF]/80 text-white hover:ring-2 hover:ring-[#0866FF]'
    }
    return 'bg-[#0866FF] text-white shadow-xs hover:ring-2 hover:ring-[#0055D6]'
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E7F3FF] dark:bg-[#0866FF]/20 flex items-center justify-center text-[#0866FF]">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
              Bản Đồ Nhiệt Tương Tác & Khung Giờ Vàng (Peak Hours Heatmap)
            </h3>
          </div>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Mật độ người dùng truy cập, đăng bài và tương tác theo 24 giờ trong 7 ngày tuần
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-[#65676B] dark:text-[#B0B3B8] font-medium">
          <span>Ít</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#F0F2F5] dark:bg-[#18191A] border border-[#E4E6EB] dark:border-[#393A3B]" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[#E7F3FF] dark:bg-[#0866FF]/20" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[#0866FF]/40" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[#0866FF]/80" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[#0866FF]" />
          </div>
          <span className="text-[#0866FF] font-bold">Rất cao (Giờ Vàng)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-2">
          {/* Hour Labels */}
          <div className="grid grid-cols-[70px_repeat(24,minmax(0,1fr))] gap-1.5 text-center text-[10px] font-semibold text-[#65676B] dark:text-[#B0B3B8]">
            <div className="text-left pl-1">Ngày</div>
            {data.hours.map((h) => (
              <div key={h} className="truncate">
                {h % 3 === 0 ? `${h}h` : ''}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {data.days.map((day, dIdx) => (
            <div key={day} className="grid grid-cols-[70px_repeat(24,minmax(0,1fr))] gap-1.5 items-center">
              <div className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate pl-1">
                {day}
              </div>
              {data.hours.map((h) => {
                const val = data.matrix[dIdx]?.[h] ?? 0
                return (
                  <div
                    key={h}
                    onMouseEnter={() =>
                      setHoveredCell({
                        day,
                        hour: h,
                        value: val,
                      })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-7 rounded-md flex items-center justify-center cursor-pointer transition-all duration-150 relative ${getCellColor(
                      val
                    )}`}
                  >
                    {val >= maxVal * 0.85 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip / Status Display */}
      <div className="h-8 flex items-center justify-between px-3 py-1.5 bg-[#F0F2F5] dark:bg-[#18191A] rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] text-xs">
        {hoveredCell ? (
          <div className="flex items-center gap-2 text-[#0866FF] font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#F5C33B]" />
            <span>
              {hoveredCell.day} vào lúc {hoveredCell.hour}:00 - {hoveredCell.hour + 1}:00:
            </span>
            <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">
              {hoveredCell.value.toLocaleString()} lượt tương tác & truy cập
            </span>
          </div>
        ) : (
          <span className="text-[#65676B] dark:text-[#B0B3B8] italic text-[11px]">
            💡 Rê chuột lên các ô trên bản đồ nhiệt để xem số liệu chi tiết từng khung giờ.
          </span>
        )}
      </div>

      {/* AI Telemetry Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-[#E7F3FF]/60 dark:bg-[#0866FF]/10 border border-[#0866FF]/20 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#0866FF] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Khung Giờ Cao Điểm
            </h4>
            <p className="text-base font-black text-[#0866FF] mt-0.5">
              {data.peakTimeRange}
            </p>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
              Chiếm <span className="font-bold text-[#0866FF]">{data.eveningActivityRatio}%</span> hoạt động cả ngày
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C]/40 border border-[#E4E6EB] dark:border-[#393A3B] flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#65676B] dark:text-[#B0B3B8] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Ngày Bùng Nổ Nhất
            </h4>
            <p className="text-base font-black text-[#050505] dark:text-[#E4E6EB] mt-0.5">
              {data.peakDay || 'Chưa xác định'}
            </p>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
              {data.totalWeeklyInteractions > 0
                ? `Tổng ${data.totalWeeklyInteractions.toLocaleString()} lượt tương tác trong tuần`
                : 'Chưa có đủ dữ liệu tương tác'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#31A24C] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Khuyến Nghị Tối Ưu
            </h4>
            <p className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] mt-0.5">
              {data.peakTimeRange && data.peakTimeRange !== '--:--'
                ? `Đăng bài vào khung ${data.peakTimeRange}`
                : 'Thu thập thêm dữ liệu khung giờ'}
            </p>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
              Giúp tối đa hóa lượt xem và tương tác của thành viên
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap

