import React from 'react'
import {
  Laptop,
  Smartphone,
  Globe2,
  Users,
  Percent,
  CheckCircle2,
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
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3" />
        <div className="h-48 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Device & Platform Breakdown */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nền Tảng & Thiết Bị Truy Cập
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tỷ lệ phân bổ phiên đăng nhập theo loại thiết bị
            </p>
          </div>
        </div>

        {/* Progress list */}
        <div className="space-y-3.5 pt-1">
          {Object.entries(data.deviceDistribution).map(([name, pct], idx) => (
            <div key={name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  {idx === 0 ? (
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                  ) : idx === 1 ? (
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Globe2 className="w-3.5 h-3.5 text-purple-500" />
                  )}
                  {name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-blue-500'
                      : idx === 1
                      ? 'bg-emerald-500'
                      : 'bg-purple-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Browsers tags */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Trình duyệt phổ biến
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.browserDistribution).map(([browser, pct]) => (
              <span
                key={browser}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                {browser}: <span className="font-bold text-blue-600 dark:text-blue-400">{pct}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics & Retention */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nhân Khẩu Học & Độ Tuổi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân khúc người dùng và tỷ lệ gắn bó hệ thống
            </p>
          </div>
        </div>

        {/* Age Groups */}
        <div className="space-y-3.5 pt-1">
          {Object.entries(data.ageGroupDistribution).map(([group, pct], idx) => (
            <div key={group} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{group}</span>
                <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-emerald-500'
                      : idx === 1
                      ? 'bg-teal-500'
                      : idx === 2
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Retention KPI Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
              Tỷ lệ giữ chân (Retention)
            </p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {data.averageRetentionRate}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <p className="text-[11px] font-bold text-blue-900 dark:text-blue-300">
              Tỷ lệ tương tác ngày (DAU/MAU)
            </p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {data.dailyActiveRatio}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemographicsChart
