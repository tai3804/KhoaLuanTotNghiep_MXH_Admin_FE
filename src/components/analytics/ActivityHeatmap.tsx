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
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
      </div>
    )
  }

  // Calculate max value in matrix for relative color scaling
  const maxVal = Math.max(
    ...data.matrix.flatMap((row) => row),
    100
  )

  const getCellColor = (val: number) => {
    const ratio = val / maxVal
    if (ratio < 0.15) {
      return 'bg-slate-100 dark:bg-[#18191a] text-slate-400 hover:ring-2 hover:ring-slate-300'
    }
    if (ratio < 0.35) {
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:ring-2 hover:ring-blue-400'
    }
    if (ratio < 0.6) {
      return 'bg-indigo-200 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-200 hover:ring-2 hover:ring-indigo-400'
    }
    if (ratio < 0.8) {
      return 'bg-indigo-500 dark:bg-indigo-600 text-white hover:ring-2 hover:ring-indigo-300'
    }
    return 'bg-gradient-to-tr from-violet-600 to-rose-500 text-white shadow-sm shadow-rose-500/20 hover:ring-2 hover:ring-rose-400'
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bản Đồ Nhiệt Tương Tác & Khung Giờ Vàng (Peak Hours Heatmap)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mật độ người dùng truy cập, đăng bài và tương tác theo 24 giờ trong 7 ngày tuần
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span>Ít</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-slate-100 dark:bg-[#18191a] border border-slate-200 dark:border-slate-700" />
            <span className="w-3.5 h-3.5 rounded-sm bg-blue-100 dark:bg-blue-950" />
            <span className="w-3.5 h-3.5 rounded-sm bg-indigo-300 dark:bg-indigo-800" />
            <span className="w-3.5 h-3.5 rounded-sm bg-indigo-600" />
            <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-violet-600 to-rose-500" />
          </div>
          <span className="text-rose-600 font-bold">Rất cao (Giờ Vàng)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-2">
          {/* Hour Labels */}
          <div className="grid grid-cols-[70px_repeat(24,minmax(0,1fr))] gap-1.5 text-center text-[10px] font-semibold text-slate-400">
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
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate pl-1">
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
      <div className="h-8 flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-[#1c1e21] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        {hoveredCell ? (
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {hoveredCell.day} vào lúc {hoveredCell.hour}:00 - {hoveredCell.hour + 1}:00:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {hoveredCell.value.toLocaleString()} lượt tương tác & truy cập
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic text-[11px]">
            💡 Rê chuột lên các ô trên bản đồ nhiệt để xem số liệu chi tiết từng khung giờ.
          </span>
        )}
      </div>

      {/* AI Telemetry Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
              Khung Giờ Cao Điểm
            </h4>
            <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {data.peakTimeRange}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Chiếm <span className="font-bold text-indigo-600">{data.eveningActivityRatio}%</span> hoạt động cả ngày
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-violet-950 dark:text-violet-200">
              Ngày Bùng Nổ Nhất
            </h4>
            <p className="text-base font-black text-violet-600 dark:text-violet-400 mt-0.5">
              {data.peakDay}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Lượng bài viết tăng +38% so với đầu tuần
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Khuyến Nghị Tối Ưu
            </h4>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              Đẩy thông báo & sự kiện lúc 20:00
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Giúp tối đa hóa lượt xem và tương tác
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap
