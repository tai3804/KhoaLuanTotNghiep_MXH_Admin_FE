import React from 'react'
import { AiStats } from '../../types/ai'
import { Sparkles, ShieldAlert, BookOpen, Bot } from 'lucide-react'

interface Props {
  stats: AiStats | null
  isLoading: boolean
}

export const AiStatsOverview: React.FC<Props> = ({ stats, isLoading }) => {
  const items = [
    {
      label: 'Tổng lượt AI đánh giá',
      value: stats?.totalEvaluations ?? 0,
      description: 'Nội dung bài viết & báo cáo được quét',
      icon: Sparkles,
      iconBg: 'bg-[#E7F3FF] dark:bg-[#0866FF]/15 text-[#0866FF] dark:text-[#2D88FF]',
      textColor: 'text-[#0866FF] dark:text-[#2D88FF]',
    },
    {
      label: 'Nội dung vi phạm bị xử lý',
      value: stats?.totalFlagged ?? 0,
      description: 'Đã thực hiện gỡ, ẩn hoặc cảnh cáo',
      icon: ShieldAlert,
      iconBg: 'bg-[#FEE2E2] dark:bg-[#FA383E]/15 text-[#FA383E]',
      textColor: 'text-[#FA383E]',
    },
    {
      label: 'Tổng từ khóa trong bộ lọc',
      value: stats?.totalKeywords ?? 0,
      description: 'Từ điển nhạy cảm nạp sẵn và học được',
      icon: BookOpen,
      iconBg: 'bg-[#FEF3C7] dark:bg-[#F5C33B]/15 text-[#B78103] dark:text-[#F5C33B]',
      textColor: 'text-[#B78103] dark:text-[#F5C33B]',
    },
    {
      label: 'Từ khóa do AI tự học',
      value: stats?.autoLearnedKeywords ?? 0,
      description: 'Phát hiện tự động qua Gemini AI',
      icon: Bot,
      iconBg: 'bg-[#DCFCE7] dark:bg-[#31A24C]/15 text-[#31A24C]',
      textColor: 'text-[#31A24C]',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-[#242526] rounded-2xl p-5 border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676B] dark:text-[#B0B3B8]">
                {item.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className={`mt-3 text-2xl lg:text-3xl font-bold tracking-tight ${item.textColor}`}>
              {isLoading ? (
                <span className="inline-block w-16 h-7 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-md animate-pulse" />
              ) : (
                item.value.toLocaleString()
              )}
            </p>
            <p className="mt-1.5 text-xs text-[#65676B] dark:text-[#B0B3B8] line-clamp-1">
              {item.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
export default AiStatsOverview
