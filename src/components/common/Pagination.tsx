import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(totalItems, currentPage * pageSize)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
        Hiển thị <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">{startItem}</span> đến{' '}
        <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">{endItem}</span> trong tổng số{' '}
        <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">{totalItems}</span> bản ghi
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            return (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1
            )
          })
          .map((page, idx, arr) => {
            const prev = arr[idx - 1]
            const showEllipsis = prev && page - prev > 1

            return (
              <React.Fragment key={page}>
                {showEllipsis && (
                  <span className="px-2 text-xs text-[#65676b] dark:text-[#b0b3b8]">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#0866ff] text-white shadow-xs font-bold'
                      : 'border border-[#e4e6eb] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            )
          })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Trang tiếp"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination

