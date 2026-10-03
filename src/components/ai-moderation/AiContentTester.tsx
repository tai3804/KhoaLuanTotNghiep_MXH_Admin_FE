import React, { useState } from 'react'
import { GeminiModerationResult } from '../../types/ai'
import { aiService } from '../../services/aiService'

export const AiContentTester: React.FC = () => {
  const [content, setContent] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<GeminiModerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEvaluate = async () => {
    if (!content.trim() || isEvaluating) return

    setIsEvaluating(true)
    setError(null)
    try {
      const data = await aiService.evaluateContent(content.trim())
      setResult(data)
    } catch (err: any) {
      setError('Không thể kết nối dịch vụ AI để đánh giá.')
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Kiểm tra trực tiếp nội dung bằng AI
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Nhập đoạn văn bản để kiểm tra phản hồi tức thì từ bộ lọc lai (Tầng 1 Fast Filter + Tầng 2 Gemini 1.5 Flash)
        </p>
      </div>

      <div className="space-y-3">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung bài viết hoặc bình luận cần thử nghiệm kiểm duyệt..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {content.length} ký tự
          </span>
          <button
            onClick={handleEvaluate}
            disabled={!content.trim() || isEvaluating}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isEvaluating ? 'Đang phân tích...' : 'Đánh giá bằng AI'}
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Kết quả đánh giá từ hệ thống AI
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500">Điểm độc hại:</span>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {Math.round((result.toxicityScore || 0) * 100)}%
                </p>
              </div>

              <div className="p-2.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500">Phân loại vi phạm:</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                  {result.category || 'NONE'}
                </p>
              </div>

              <div className="p-2.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500">Mức độ cảnh báo:</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                  {result.severity || 'LOW'}
                </p>
              </div>

              <div className="p-2.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <span className="text-gray-500">Hành động đề xuất:</span>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {result.suggestedAction || 'ALLOW'}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">Lý do nhận định: </span>
              {result.reason || 'Nội dung phù hợp tiêu chuẩn'}
            </div>

            {result.extractedKeywords && result.extractedKeywords.length > 0 && (
              <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">Từ khóa trích xuất: </span>
                {result.extractedKeywords.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default AiContentTester
