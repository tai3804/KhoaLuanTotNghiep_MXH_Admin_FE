import React from 'react'
import { SearchX, Sparkles } from 'lucide-react'

interface SearchEmptyStateProps {
  query?: string
  onReset?: () => void
  onSuggestionClick?: (keyword: string) => void
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  onReset,
  onSuggestionClick,
}) => {
  const suggestions = ['admin', 'spam', 'công khai', 'bài viết mới', 'thành viên']

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#393a3b] p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#3a3b3c] flex items-center justify-center text-slate-400 dark:text-[#b0b3b8] mb-4">
        <SearchX className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-[#e4e6eb] mb-1">
        {query ? `Không tìm thấy kết quả phù hợp cho "${query}"` : 'Chưa có kết quả tìm kiếm'}
      </h3>
      <p className="text-xs text-slate-500 dark:text-[#b0b3b8] max-w-md mb-6">
        Hãy kiểm tra lại chính tả từ khóa, thử đổi từ ngữ tìm kiếm tổng quát hơn hoặc điều chỉnh lại bộ lọc trạng thái.
      </p>

      {/* Suggested keywords */}
      <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Từ khóa gợi ý:
        </span>
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => onSuggestionClick?.(item)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#3a3b3c] text-slate-700 dark:text-[#e4e6eb] hover:bg-[#1877f2]/10 hover:text-[#1877f2] dark:hover:text-[#2d88ff] transition-colors cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1877f2] text-white hover:bg-[#166fe5] shadow-xs transition-all cursor-pointer"
        >
          Xóa toàn bộ bộ lọc
        </button>
      )}
    </div>
  )
}

export default SearchEmptyState
