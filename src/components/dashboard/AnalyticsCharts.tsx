import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { UserGrowthStat } from '../../types/dashboard'
import { useAppSelector } from '../../store'

export interface AnalyticsChartsProps {
  data: UserGrowthStat[]
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  const isDark = useAppSelector((state) => state.theme.isDark)

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#e4e6eb]">
            Tăng Trưởng Người Dùng Mới
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#b0b3b8] mt-0.5">
            Thống kê tài khoản đăng ký mới theo thời gian
          </p>
        </div>
      </div>

      <div className="h-72 w-full flex items-center justify-center">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#b0b3b8] gap-2">
            <BarChart3 className="w-8 h-8 opacity-40" />
            <span className="text-xs">Chưa có dữ liệu thống kê tăng trưởng từ máy chủ</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1877f2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#393a3b' : '#f0f2f5'}
              />
              <XAxis
                dataKey="date"
                stroke={isDark ? '#b0b3b8' : '#8a8d91'}
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke={isDark ? '#b0b3b8' : '#8a8d91'}
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#242526' : '#ffffff',
                  borderColor: isDark ? '#393a3b' : '#e4e6eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: isDark ? '#e4e6eb' : '#050505',
                }}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="User mới"
                stroke="#1877f2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default AnalyticsCharts

