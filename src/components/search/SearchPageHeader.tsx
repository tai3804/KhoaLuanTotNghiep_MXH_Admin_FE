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
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#1877f2]/10 text-[#1877f2]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-[#e4e6eb]">
                Tìm Kiếm & Bộ Lọc Hệ Thống
              </h1>
              <Badge variant="primary" size="sm">
                {totalResults} kết quả
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#b0b3b8] mt-0.5">
              Tra cứu toàn diện tài khoản, bài viết, báo cáo vi phạm và hội nhóm trong cơ sở dữ liệu
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#e4e6eb] bg-white dark:bg-[#242526] border border-slate-200 dark:border-[#393a3b] hover:bg-slate-50 dark:hover:bg-[#3a3b3c] hover:text-[#1877f2] dark:hover:text-[#2d88ff] transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          title="Tải lại toàn bộ dữ liệu mới nhất từ máy chủ"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#1877f2]' : ''}`} />
          <span>{isFetching ? 'Đang cập nhật...' : 'Cập nhật dữ liệu'}</span>
        </button>
      </div>
    </div>
  )
}

export default SearchPageHeader
