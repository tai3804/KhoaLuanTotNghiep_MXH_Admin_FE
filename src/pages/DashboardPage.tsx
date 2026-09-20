import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setStats,
  setChartsData,
  setLoading,
} from '../store/slices/dashboardSlice'
import { setReports } from '../store/slices/reportSlice'
import { dashboardService } from '../services/dashboardService'
import { reportService } from '../services/reportService'
import DashboardMetrics from '../components/dashboard/DashboardMetrics'
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import RecentActivity from '../components/dashboard/RecentActivity'

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { stats, userGrowth, reportCategories, isLoading } = useAppSelector(
    (state) => state.dashboard
  )
  const reports = useAppSelector((state) => state.report.reports)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      try {
        const [statsData, growthData, interData, catData, reportsData] =
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getUserGrowthStats(),
            dashboardService.getInteractionStats(),
            dashboardService.getReportCategories(),
            reportService.getAllReports(),
          ])

        dispatch(setStats(statsData))
        dispatch(
          setChartsData({
            userGrowth: growthData,
            interactions: interData,
            reportCategories: catData,
          })
        )
        dispatch(setReports(reportsData))
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchData()
  }, [dispatch])

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Bảng Điều Khiển Tổng Quan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi số liệu tăng trưởng, tương tác và báo cáo vi phạm toàn hệ thống mạng xã hội
        </p>
      </div>

      {/* KPI Stat Cards */}
      <DashboardMetrics stats={stats} isLoading={isLoading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsCharts data={userGrowth} />
        </div>
        <div>
          <CategoryPieChart data={reportCategories} />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity reports={reports} />
    </div>
  )
}

export default DashboardPage
