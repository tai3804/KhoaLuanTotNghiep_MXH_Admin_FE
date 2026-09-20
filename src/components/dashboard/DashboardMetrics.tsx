import React from 'react'
import { Users, FileText, AlertTriangle, ShieldCheck } from 'lucide-react'
import StatCard from '../common/StatCard'
import { DashboardStats } from '../../types/dashboard'

export interface DashboardMetricsProps {
  stats: DashboardStats | null
  isLoading?: boolean
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Tổng Người Dùng"
        value={stats?.totalUsers !== undefined ? stats.totalUsers.toLocaleString() : '0'}
        icon={<Users className="w-6 h-6" />}
        colorVariant="indigo"
      />

      <StatCard
        title="Tổng Bài Viết"
        value={stats?.totalPosts !== undefined ? stats.totalPosts.toLocaleString() : '0'}
        icon={<FileText className="w-6 h-6" />}
        colorVariant="emerald"
      />

      <StatCard
        title="Tổng Báo Cáo"
        value={stats?.totalReports !== undefined ? stats.totalReports.toLocaleString() : '0'}
        icon={<ShieldCheck className="w-6 h-6" />}
        colorVariant="sky"
      />

      <StatCard
        title="Báo Cáo Chờ Duyệt"
        value={stats?.pendingReports !== undefined ? stats.pendingReports.toLocaleString() : '0'}
        icon={<AlertTriangle className="w-6 h-6" />}
        colorVariant="rose"
      />
    </div>
  )
}

export default DashboardMetrics
