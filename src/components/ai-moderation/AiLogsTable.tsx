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
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
    case 'AUTO_HIDE':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
    case 'WARN_USER':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
    case 'ALLOW':
    default:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
  }
}

const getSeverityBadgeClass = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 font-semibold'
    case 'HIGH':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'LOW':
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Nhật ký kiểm duyệt tự động
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Lịch sử các quyết định và điểm đánh giá độc hại do AI xử lý
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Tổng số: {totalElements.toLocaleString()} bản ghi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3">Mục tiêu</th>
              <th className="px-4 py-3">Đoạn trích nội dung</th>
              <th className="px-4 py-3 text-center">Điểm vi phạm</th>
              <th className="px-4 py-3">Danh mục / Mức độ</th>
              <th className="px-4 py-3">Hành động AI</th>
              <th className="px-4 py-3">Lý do xử lý</th>
              <th className="px-4 py-3 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Đang tải dữ liệu nhật ký...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Chưa có nhật ký kiểm duyệt nào được ghi nhận.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const percentage = Math.round((log.toxicityScore || 0) * 100)
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-200">
                        {log.targetType}
                      </div>
                      <div className="font-mono text-[11px] text-gray-400 truncate max-w-[120px]">
                        ID: {log.targetId ? String(log.targetId).substring(0, 8) + '...' : '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2">
                        {log.contentSnippet || '(Không có nội dung)'}
                      </p>
                      {log.extractedKeywords && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                          Từ nhạy cảm: {log.extractedKeywords}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {percentage}%
                        </span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              percentage >= 85
                                ? 'bg-red-600'
                                : percentage >= 65
                                ? 'bg-orange-500'
                                : percentage >= 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {log.category || 'NONE'}
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[10px] rounded mt-0.5 ${getSeverityBadgeClass(
                          log.severity
                        )}`}
                      >
                        {log.severity || 'LOW'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getActionBadgeClass(
                          log.actionTaken
                        )}`}
                      >
                        {log.actionTaken}
                      </span>
                      {log.isFallback && (
                        <div className="text-[10px] text-gray-400 mt-0.5">Bộ lọc dự phòng</div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs text-xs text-gray-600 dark:text-gray-400">
                      {log.reason || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 whitespace-nowrap">
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
