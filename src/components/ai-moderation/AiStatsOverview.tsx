import React from 'react'
import { AiStats } from '../../types/ai'

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
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Nội dung vi phạm bị xử lý',
      value: stats?.totalFlagged ?? 0,
      description: 'Đã thực hiện gỡ, ẩn hoặc cảnh cáo',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: 'Tổng từ khóa trong bộ lọc',
      value: stats?.totalKeywords ?? 0,
      description: 'Từ điển nhạy cảm nạp sẵn và học được',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Từ khóa do AI tự học',
      value: stats?.autoLearnedKeywords ?? 0,
      description: 'Phát hiện tự động qua Gemini 1.5 Flash',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {item.label}
          </p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${item.textColor}`}>
            {isLoading ? '...' : item.value.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}
export default AiStatsOverview
