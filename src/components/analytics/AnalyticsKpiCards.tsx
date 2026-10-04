import React from 'react'
import { Zap, Clock, Flame, Users } from 'lucide-react'
import {
  ActivityHeatmapData,
  TrendingHashtag,
  DemographicsData,
} from '../../types/analytics'

interface AnalyticsKpiCardsProps {
  heatmap: ActivityHeatmapData | null
  trends: TrendingHashtag[]
  demographics: DemographicsData | null
}

export const AnalyticsKpiCards: React.FC<AnalyticsKpiCardsProps> = ({
  heatmap,
  trends,
  demographics,
}) => {
  const topTrend = trends.length > 0 ? trends[0] : null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Weekly Interactions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-[#1877f2] flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tương Tác Tuần
          </p>
          <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {(heatmap?.totalWeeklyInteractions ?? 0).toLocaleString()}
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
            {heatmap && heatmap.eveningActivityRatio > 0
              ? `${heatmap.eveningActivityRatio}% vào khung giờ tối (18h-23h)`
              : 'Chưa có tương tác ghi nhận'}
          </span>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Khung Giờ Vàng
          </p>
          <h4 className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {heatmap?.peakTimeRange || '--:--'}
          </h4>
          <span className="text-[11px] text-slate-400 truncate block">
            {heatmap?.peakDay || 'Chưa xác định'}
          </span>
        </div>
      </div>

      {/* Viral Hashtag */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Hashtag Bùng Nổ
          </p>
          <h4 className="text-base font-black text-amber-600 dark:text-amber-400 truncate mt-0.5">
            {topTrend?.tag || 'Chưa có'}
          </h4>
          <span className="text-[11px] font-bold text-emerald-500 truncate block">
            {topTrend
              ? `+${topTrend.growthPercentage}% (${topTrend.postCount} bài viết)`
              : 'Chưa có hashtag thịnh hành'}
          </span>
        </div>
      </div>

      {/* User Retention */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Tỷ Lệ Giữ Chân
          </p>
          <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {demographics?.averageRetentionRate != null && demographics.averageRetentionRate > 0
              ? `${demographics.averageRetentionRate}%`
              : '--%'}
          </h4>
          <span className="text-[11px] text-slate-400 truncate block">
            {demographics?.dailyActiveRatio != null && demographics.dailyActiveRatio > 0
              ? `${demographics.dailyActiveRatio}% hoạt động mỗi ngày`
              : 'Chưa có phân tích'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsKpiCards
