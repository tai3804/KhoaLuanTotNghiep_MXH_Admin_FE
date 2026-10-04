import React, { useState } from 'react'
import { SensitiveKeyword } from '../../types/ai'
import Pagination from '../common/Pagination'
import { Plus, Check, ShieldAlert, Sparkles, Filter } from 'lucide-react'

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
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#E4E6EB] dark:border-[#393A3B]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
              Từ điển nhạy cảm & Từ khóa AI tự học
            </h3>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
              Danh sách từ khóa cấm nạp sẵn và từ lóng mới do Gemini AI phát hiện trong quá trình kiểm duyệt
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]">
            {totalElements} từ khóa
          </span>
        </div>

        {/* Add keyword form */}
        <form onSubmit={handleAddSubmit} className="mt-4 flex flex-wrap gap-2.5 items-center">
          <input
            type="text"
            placeholder="Nhập từ khóa mới..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="flex-1 min-w-[200px] px-3.5 py-2 text-sm rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 focus:border-[#0866FF]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20"
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
            className="px-3 py-2 text-sm rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20"
          >
            <option value="LOW">Mức thấp (LOW)</option>
            <option value="MEDIUM">Mức trung bình (MEDIUM)</option>
            <option value="HIGH">Mức cao (HIGH)</option>
            <option value="CRITICAL">Nghiêm trọng (CRITICAL)</option>
          </select>
          <button
            type="submit"
            disabled={!newWord.trim() || isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#0866FF] hover:bg-[#0055D6] disabled:opacity-50 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? 'Đang thêm...' : 'Thêm từ khóa'}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#050505] dark:text-[#E4E6EB]">
          <thead className="bg-[#F0F2F5]/80 dark:bg-[#18191A]/80 text-[11px] uppercase font-bold text-[#65676B] dark:text-[#B0B3B8] border-b border-[#E4E6EB] dark:border-[#393A3B]">
            <tr>
              <th className="px-5 py-3.5">Từ khóa</th>
              <th className="px-5 py-3.5">Nguồn gốc</th>
              <th className="px-5 py-3.5">Danh mục</th>
              <th className="px-5 py-3.5">Mức độ</th>
              <th className="px-5 py-3.5 text-center">Số lần kích hoạt</th>
              <th className="px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E6EB] dark:divide-[#393A3B]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#65676B] dark:text-[#B0B3B8]">
                  Đang tải từ khóa...
                </td>
              </tr>
            ) : keywords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#65676B] dark:text-[#B0B3B8]">
                  Chưa có từ khóa nào trong danh sách.
                </td>
              </tr>
            ) : (
              keywords.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F0F2F5]/70 dark:hover:bg-[#3A3B3C]/40 transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-[#050505] dark:text-[#E4E6EB]">
                    {item.keyword}
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    {item.isAutoLearned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#0866FF] dark:bg-[#0866FF]/20 dark:text-[#2D88FF]">
                        <Sparkles className="w-3 h-3" />
                        AI tự học
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F2F5] text-[#65676B] dark:bg-[#3A3B3C] dark:text-[#B0B3B8]">
                        Quản trị viên
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium text-[#65676B] dark:text-[#B0B3B8]">{item.category}</td>
                  <td className="px-5 py-3.5 text-xs font-mono font-semibold">{item.severity}</td>
                  <td className="px-5 py-3.5 text-center text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                    {item.hitCount || 0}
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    {item.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#31A24C] dark:bg-[#31A24C]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#31A24C]" />
                        Đang áp dụng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B78103] dark:bg-[#F5C33B]/20 dark:text-[#F5C33B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5C33B]" />
                        Chờ phê duyệt
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {item.isAutoLearned && item.status !== 'ACTIVE' ? (
                      <button
                        onClick={() => handleApproveClick(item.id)}
                        disabled={approvingId === item.id}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#31A24C] hover:bg-[#28833C] disabled:opacity-50 rounded-xl transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {approvingId === item.id ? 'Đang duyệt...' : 'Phê duyệt'}
                      </button>
                    ) : (
                      <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">Đã chuẩn hóa</span>
                    )}
                  </td>
                </tr>
              ))
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
export default AiKeywordsManager
