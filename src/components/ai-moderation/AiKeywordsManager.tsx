import React, { useState } from 'react'
import { SensitiveKeyword } from '../../types/ai'
import Pagination from '../common/Pagination'

interface Props {
  keywords: SensitiveKeyword[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
  onApprove: (id: string) => Promise<void>
  onAdd: (data: { keyword: string; category?: string; severity?: string }) => Promise<void>
}

export const AiKeywordsManager: React.FC<Props> = ({
  keywords,
  isLoading,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onApprove,
  onAdd,
}) => {
  const [newWord, setNewWord] = useState('')
  const [category, setCategory] = useState('PROFANITY')
  const [severity, setSeverity] = useState('MEDIUM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWord.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onAdd({
        keyword: newWord.trim().toLowerCase(),
        category,
        severity,
      })
      setNewWord('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproveClick = async (id: string) => {
    setApprovingId(id)
    try {
      await onApprove(id)
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Từ điển nhạy cảm & Từ khóa AI tự học
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Danh sách các từ khóa cấm nạp sẵn và các từ lóng mới do Gemini AI phát hiện trong quá trình kiểm duyệt
        </p>

        {/* Add keyword form */}
        <form onSubmit={handleAddSubmit} className="mt-4 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Nhập từ khóa mới..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="PROFANITY">PROFANITY (Tục tĩu)</option>
            <option value="HATE_SPEECH">HATE_SPEECH (Thù ghét)</option>
            <option value="HARASSMENT">HARASSMENT (Quấy rối)</option>
            <option value="SEXUAL">SEXUAL (18+)</option>
            <option value="VIOLENCE">VIOLENCE (Bạo lực)</option>
            <option value="SPAM_SCAM">SPAM_SCAM (Lừa đảo)</option>
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="LOW">Mức thấp (LOW)</option>
            <option value="MEDIUM">Mức trung bình (MEDIUM)</option>
            <option value="HIGH">Mức cao (HIGH)</option>
            <option value="CRITICAL">Nghiêm trọng (CRITICAL)</option>
          </select>
          <button
            type="submit"
            disabled={!newWord.trim() || isSubmitting}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm từ khóa'}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3">Từ khóa</th>
              <th className="px-4 py-3">Nguồn gốc</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Mức độ</th>
              <th className="px-4 py-3 text-center">Số lần kích hoạt</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Đang tải từ khóa...
                </td>
              </tr>
            ) : keywords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Chưa có từ khóa nào trong danh sách.
                </td>
              </tr>
            ) : (
              keywords.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {item.keyword}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {item.isAutoLearned ? (
                      <span className="px-2 py-0.5 rounded text-[11px] bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        AI tự học
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        Quản trị viên
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">{item.category}</td>
                  <td className="px-4 py-3 text-xs font-mono">{item.severity}</td>
                  <td className="px-4 py-3 text-center text-xs font-semibold">
                    {item.hitCount || 0}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {item.status === 'ACTIVE' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Đang áp dụng
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Chờ phê duyệt
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.isAutoLearned && item.status !== 'ACTIVE' ? (
                      <button
                        onClick={() => handleApproveClick(item.id)}
                        disabled={approvingId === item.id}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded transition-colors"
                      >
                        {approvingId === item.id ? 'Đang duyệt...' : 'Phê duyệt'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Đã chuẩn hóa</span>
                    )}
                  </td>
                </tr>
              ))
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
export default AiKeywordsManager
