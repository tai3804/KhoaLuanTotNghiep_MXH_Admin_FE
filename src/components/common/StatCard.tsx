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
    indigo: 'bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] border-[#0866ff]/20',
    emerald: 'bg-[#e7f8ed] text-[#31a24c] dark:bg-[#31a24c]/20 dark:text-[#42b72a] border-[#31a24c]/20',
    rose: 'bg-[#ffebe8] text-[#fa383e] dark:bg-[#fa383e]/20 dark:text-[#ff5a5f] border-[#fa383e]/20',
    amber: 'bg-[#fff8e1] text-[#b78103] dark:bg-[#f5c33b]/20 dark:text-[#f5c33b] border-[#f5c33b]/20',
    sky: 'bg-[#e5f6fd] text-[#0288d1] dark:bg-[#0288d1]/20 dark:text-[#29b6f6] border-[#0288d1]/20',
    purple: 'bg-[#f3e8ff] text-[#9333ea] dark:bg-[#9333ea]/20 dark:text-[#c084fc] border-[#9333ea]/20',
  }[colorVariant]

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[#050505] dark:text-[#e4e6eb] mt-2 tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-2xl border ${iconBgClasses}`}>
          {icon}
        </div>
      </div>

      {changePercent !== undefined && (
        <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold">
          <span
            className={`flex items-center gap-0.5 ${
              trend === 'up'
                ? 'text-[#31a24c]'
                : trend === 'down'
                ? 'text-[#fa383e]'
                : 'text-[#65676b] dark:text-[#b0b3b8]'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`}
          </span>
          <span className="text-[#65676b] dark:text-[#b0b3b8] font-normal">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard

