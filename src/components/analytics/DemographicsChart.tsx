import React from 'react'
import {
  Users2,
  ShieldCheck,
  Users,
  Activity,
  UserCheck,
} from 'lucide-react'
import { DemographicsData } from '../../types/analytics'

interface DemographicsChartProps {
  data: DemographicsData | null
  isLoading?: boolean
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-md w-1/3" />
        <div className="h-48 bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 rounded-xl" />
      </div>
    )
  }

  const totalAgeCount = Object.values(data.ageGroupDistribution || {}).reduce(
    (sum, val) => sum + (typeof val === 'number' ? val : 0),
    0
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender & Account Status Breakdown */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E7F3FF] dark:bg-[#0866FF]/20 flex items-center justify-center text-[#0866FF]">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
              Cơ Cấu Giới Tính & Trạng Thái
            </h3>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Tỷ lệ giới tính và trạng thái tài khoản thực tế của người dùng
            </p>
          </div>
        </div>

        {/* Gender Distribution Progress list */}
        <div className="space-y-3.5 pt-1">
          <p className="text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
            Phân Bổ Giới Tính
          </p>
          {Object.entries(data.deviceDistribution || {}).map(([name, pct], idx) => (
            <div key={name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#050505] dark:text-[#E4E6EB]">
                <span>{name}</span>
                <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-[#0866FF]'
                      : idx === 1
                      ? 'bg-pink-500'
                      : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Status Breakdown */}
        <div className="pt-3 border-t border-[#E4E6EB] dark:border-[#393A3B]">
          <p className="text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider mb-2">
            Trạng Thái Tài Khoản
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.browserDistribution || {}).map(([statusName, pct]) => (
              <span
                key={statusName}
                className="px-2.5 py-1 rounded-lg bg-[#F0F2F5] dark:bg-[#3A3B3C] border border-[#E4E6EB] dark:border-[#393A3B] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#31A24C]" />
                {statusName}: <span className="font-bold text-[#0866FF] dark:text-[#2D88FF]">{pct}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics & Age Groups */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#31A24C]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
              Nhân Khẩu Học & Độ Tuổi
            </h3>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Phân khúc người dùng theo ngày sinh đã đăng ký
            </p>
          </div>
        </div>

        {/* Age Groups */}
        <div className="space-y-3.5 pt-1">
          {Object.entries(data.ageGroupDistribution || {}).map(([group, count], idx) => {
            const pct = totalAgeCount > 0 ? Math.round((Number(count) * 100) / totalAgeCount) : 0
            return (
              <div key={group} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#050505] dark:text-[#E4E6EB]">
                  <span>{group} ({count} người)</span>
                  <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? 'bg-[#31A24C]'
                        : idx === 1
                        ? 'bg-[#0866FF]'
                        : idx === 2
                        ? 'bg-[#F5C33B]'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Real User Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E4E6EB] dark:border-[#393A3B]">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[11px] font-bold text-[#31A24C] flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Tỷ lệ tài khoản hoạt động
            </p>
            <p className="text-lg font-black text-[#31A24C] mt-0.5">
              {data.averageRetentionRate}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#E7F3FF] dark:bg-[#0866FF]/10 border border-[#0866FF]/20">
            <p className="text-[11px] font-bold text-[#0866FF] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Tỷ lệ đang Online
            </p>
            <p className="text-lg font-black text-[#0866FF] mt-0.5">
              {data.dailyActiveRatio}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemographicsChart

