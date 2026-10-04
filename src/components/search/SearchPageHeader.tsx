import React from 'react'
import { Search, RefreshCw } from 'lucide-react'
import Badge from '../common/Badge'

interface SearchPageHeaderProps {
  totalResults: number
  isFetching: boolean
  onRefresh: () => void
}

export const SearchPageHeader: React.FC<SearchPageHeaderProps> = ({
  totalResults,
  isFetching,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#050505] dark:text-[#E4E6EB]">
                Tìm Kiếm & Bộ Lọc Hệ Thống
              </h1>
              <Badge variant="primary" size="sm">
                {totalResults} kết quả
              </Badge>
            </div>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
              Tra cứu toàn diện tài khoản, bài viết, báo cáo vi phạm và hội nhóm trong cơ sở dữ liệu
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] hover:text-[#0866FF] dark:hover:text-[#2D88FF] transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          title="Tải lại toàn bộ dữ liệu mới nhất từ máy chủ"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#0866FF]' : ''}`} />
          <span>{isFetching ? 'Đang cập nhật...' : 'Cập nhật dữ liệu'}</span>
        </button>
      </div>
    </div>
  )
}

export default SearchPageHeader

