import React from 'react'
import { AiModerationLog } from '../../types/ai'
import Pagination from '../common/Pagination'

interface Props {
  logs: AiModerationLog[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
}

const getActionBadgeClass = (action: string) => {
  switch (action?.toUpperCase()) {
    case 'DELETE_POST':
      return 'bg-[#FEE2E2] text-[#FA383E] dark:bg-[#FA383E]/20'
    case 'AUTO_HIDE':
      return 'bg-[#FFEDD5] text-[#EA580C] dark:bg-[#EA580C]/20'
    case 'WARN_USER':
      return 'bg-[#FEF3C7] text-[#B78103] dark:bg-[#F5C33B]/20 dark:text-[#F5C33B]'
    case 'ALLOW':
    default:
      return 'bg-[#DCFCE7] text-[#31A24C] dark:bg-[#31A24C]/20'
  }
}

const getSeverityBadgeClass = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-[#FEE2E2] text-[#FA383E] dark:bg-[#FA383E]/20 font-bold'
    case 'HIGH':
      return 'bg-[#FEF3C7] text-[#B78103] dark:bg-[#F5C33B]/20 dark:text-[#F5C33B] font-semibold'
    case 'MEDIUM':
      return 'bg-[#E7F3FF] text-[#0866FF] dark:bg-[#0866FF]/20 dark:text-[#2D88FF]'
    case 'LOW':
    default:
      return 'bg-[#F0F2F5] text-[#65676B] dark:bg-[#3A3B3C] dark:text-[#B0B3B8]'
  }
}

export const AiLogsTable: React.FC<Props> = ({
  logs,
  isLoading,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#E4E6EB] dark:border-[#393A3B] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
            Nhật ký kiểm duyệt tự động
          </h3>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
            Lịch sử các quyết định và điểm đánh giá độc hại do AI xử lý
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]">
          Tổng số: {totalElements.toLocaleString()} bản ghi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#050505] dark:text-[#E4E6EB]">
          <thead className="bg-[#F0F2F5]/80 dark:bg-[#18191A]/80 text-[11px] uppercase font-bold text-[#65676B] dark:text-[#B0B3B8] border-b border-[#E4E6EB] dark:border-[#393A3B]">
            <tr>
              <th className="px-5 py-3.5">Mục tiêu</th>
              <th className="px-5 py-3.5">Đoạn trích nội dung</th>
              <th className="px-5 py-3.5 text-center">Điểm vi phạm</th>
              <th className="px-5 py-3.5">Danh mục / Mức độ</th>
              <th className="px-5 py-3.5">Hành động AI</th>
              <th className="px-5 py-3.5">Lý do xử lý</th>
              <th className="px-5 py-3.5 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E6EB] dark:divide-[#393A3B]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#65676B] dark:text-[#B0B3B8]">
                  Đang tải dữ liệu nhật ký...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#65676B] dark:text-[#B0B3B8]">
                  Chưa có nhật ký kiểm duyệt nào được ghi nhận.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const percentage = Math.round((log.toxicityScore || 0) * 100)
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-[#F0F2F5]/70 dark:hover:bg-[#3A3B3C]/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                        {log.targetType}
                      </div>
                      <div className="font-mono text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate max-w-[120px]">
                        ID: {log.targetId ? String(log.targetId).substring(0, 8) + '...' : '-'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-xs text-[#050505] dark:text-[#E4E6EB] line-clamp-2">
                        {log.contentSnippet || '(Không có nội dung)'}
                      </p>
                      {log.extractedKeywords && (
                        <p className="text-[11px] text-[#0866FF] dark:text-[#2D88FF] font-semibold mt-1 truncate">
                          Từ nhạy cảm: {log.extractedKeywords}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                          {percentage}%
                        </span>
                        <div className="w-16 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              percentage >= 85
                                ? 'bg-[#FA383E]'
                                : percentage >= 65
                                ? 'bg-[#EA580C]'
                                : percentage >= 40
                                ? 'bg-[#F5C33B]'
                                : 'bg-[#31A24C]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB]">
                        {log.category || 'NONE'}
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] rounded-full mt-1 font-semibold ${getSeverityBadgeClass(
                          log.severity
                        )}`}
                      >
                        {log.severity || 'LOW'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getActionBadgeClass(
                          log.actionTaken
                        )}`}
                      >
                        {log.actionTaken}
                      </span>
                      {log.isFallback && (
                        <div className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] mt-0.5">Bộ lọc dự phòng</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs text-xs text-[#65676B] dark:text-[#B0B3B8]">
                      {log.reason || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-[#65676B] dark:text-[#B0B3B8] whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '-'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-[#E4E6EB] dark:border-[#393A3B]">
          <Pagination
            currentPage={currentPage + 1}
            totalItems={totalElements}
            pageSize={15}
            onPageChange={(p) => onPageChange(p - 1)}
          />
        </div>
      )}
    </div>
  )
}
export default AiLogsTable
