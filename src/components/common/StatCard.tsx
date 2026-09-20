import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  changePercent?: number
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  colorVariant?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'purple'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  changePercent,
  changeLabel = 'so với tuần trước',
  trend = 'up',
  colorVariant = 'indigo',
}) => {
  const iconBgClasses = {
    indigo: 'bg-[#1877f2]/10 text-[#1877f2] dark:text-[#2d88ff] border-[#1877f2]/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  }[colorVariant]

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-[#b0b3b8] uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-[#e4e6eb] mt-2">
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl border ${iconBgClasses}`}>
          {icon}
        </div>
      </div>

      {changePercent !== undefined && (
        <div className="flex items-center gap-1.5 mt-4 text-xs font-medium">
          <span
            className={`flex items-center gap-0.5 ${
              trend === 'up'
                ? 'text-emerald-500'
                : trend === 'down'
                ? 'text-rose-500'
                : 'text-slate-400 dark:text-[#b0b3b8]'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
          </span>
          <span className="text-slate-400 dark:text-[#b0b3b8]">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
