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
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-10 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] flex items-center justify-center text-[#65676B] dark:text-[#B0B3B8] mb-4">
        <SearchX className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB] mb-1">
        {query ? `Không tìm thấy kết quả phù hợp cho "${query}"` : 'Chưa có kết quả tìm kiếm'}
      </h3>
      <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] max-w-md mb-6">
        Hãy kiểm tra lại chính tả từ khóa, thử đổi từ ngữ tìm kiếm tổng quát hơn hoặc điều chỉnh lại bộ lọc trạng thái.
      </p>

      {/* Suggested keywords */}
      <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
        <span className="text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#F5C33B]" /> Từ khóa gợi ý:
        </span>
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => onSuggestionClick?.(item)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] hover:bg-[#E7F3FF] hover:text-[#0866FF] dark:hover:text-[#2D88FF] transition-colors cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0866FF] text-white hover:bg-[#0055D6] shadow-xs transition-all cursor-pointer"
        >
          Xóa toàn bộ bộ lọc
        </button>
      )}
    </div>
  )
}

export default SearchEmptyState

