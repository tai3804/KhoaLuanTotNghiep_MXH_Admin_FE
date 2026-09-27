import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  Flame,
  Clock,
  Users,
  Calendar,
  FileDown,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setHeatmap,
  setTrends,
  setDemographics,
  setTimeRange,
  setLoading,
} from '../store/slices/analyticsSlice'
import { analyticsService } from '../services/analyticsService'
import AnalyticsHeader from '../components/analytics/AnalyticsHeader'
import AnalyticsKpiCards from '../components/analytics/AnalyticsKpiCards'
import ActivityHeatmap from '../components/analytics/ActivityHeatmap'
import TrendingHashtags from '../components/analytics/TrendingHashtags'
import DemographicsChart from '../components/analytics/DemographicsChart'
import AnalyticsExportModal from '../components/analytics/AnalyticsExportModal'
import { TimeRange } from '../types/analytics'

export const AnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { heatmap, trends, demographics, selectedTimeRange, isLoading } =
    useAppSelector((state) => state.analytics)
  const dashboardStats = useAppSelector((state) => state.dashboard.stats)
  const [isExportOpen, setIsExportOpen] = useState(false)

  const fetchData = async () => {
    // 0ms instant loading if state is already present
    if (!heatmap) {
      dispatch(setLoading(true))
    }
    try {
      const [heatmapData, trendsData, demoData] = await Promise.all([
        analyticsService.getHeatmap(),
        analyticsService.getTrendingHashtags(),
        analyticsService.getDemographics(),
      ])

      dispatch(setHeatmap(heatmapData))
      dispatch(setTrends(trendsData))
      dispatch(setDemographics(demoData))
    } catch (err) {
      console.error('Failed to load analytics data:', err)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Range Controls */}
      <AnalyticsHeader
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={(range) => dispatch(setTimeRange(range))}
        onRefresh={fetchData}
        onOpenExport={() => setIsExportOpen(true)}
        isLoading={isLoading}
      />

      {/* KPI Overview Cards */}
      <AnalyticsKpiCards
        heatmap={heatmap}
        trends={trends}
        demographics={demographics}
      />

      {/* Heatmap Section */}
      <ActivityHeatmap data={heatmap} isLoading={isLoading} />

      {/* Trending Hashtags Section */}
      <TrendingHashtags hashtags={trends} isLoading={isLoading} />

      {/* Demographics & Devices */}
      <DemographicsChart data={demographics} isLoading={isLoading} />

      {/* Export Modal */}
      <AnalyticsExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        timeRange={selectedTimeRange}
        heatmap={heatmap}
        trends={trends}
        demographics={demographics}
        stats={dashboardStats}
      />
    </div>
  )
}

export default AnalyticsPage
