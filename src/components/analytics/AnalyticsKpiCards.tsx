import React from 'react'
import { Zap, Clock, Flame, UserCheck } from 'lucide-react'
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
  const totalInteractions = heatmap?.totalWeeklyInteractions ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Weekly Interactions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
            Tương Tác Thực Tế
          </p>
          <h4 className="text-lg font-black text-[#050505] dark:text-[#E4E6EB] mt-0.5">
            {totalInteractions.toLocaleString()}
          </h4>
          <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate block">
            {totalInteractions > 0 && heatmap && heatmap.eveningActivityRatio > 0
              ? `${heatmap.eveningActivityRatio}% vào khung giờ tối (18h-23h)`
              : 'Chưa có lượt tương tác ghi nhận'}
          </span>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
            Khung Giờ Cao Điểm
          </p>
          <h4 className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {totalInteractions > 0 ? (heatmap?.peakTimeRange || '--:--') : '--:--'}
          </h4>
          <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate block">
            {totalInteractions > 0 ? (heatmap?.peakDay || 'Chưa xác định') : 'Chưa có đủ dữ liệu'}
          </span>
        </div>
      </div>

      {/* Viral Hashtag */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-amber-500/10 text-[#F5C33B] flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
            Hashtag Nổi Bật
          </p>
          <h4 className="text-base font-black text-[#B78103] dark:text-[#F5C33B] truncate mt-0.5">
            {topTrend?.tag || 'Chưa có'}
          </h4>
          <span className="text-[11px] font-bold text-[#31A24C] truncate block">
            {topTrend
              ? `${topTrend.postCount} bài viết đính kèm`
              : 'Chưa có hashtag trong bài viết'}
          </span>
        </div>
      </div>

      {/* User Retention / Active Users */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-[#31A24C] flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
            Tài Khoản Hoạt Động
          </p>
          <h4 className="text-lg font-black text-[#31A24C] mt-0.5">
            {demographics?.averageRetentionRate != null && demographics.averageRetentionRate > 0
              ? `${demographics.averageRetentionRate}%`
              : '0%'}
          </h4>
          <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate block">
            {demographics?.dailyActiveRatio != null && demographics.dailyActiveRatio > 0
              ? `${demographics.dailyActiveRatio}% tài khoản đang Online`
              : 'Chưa có tài khoản online'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsKpiCards

