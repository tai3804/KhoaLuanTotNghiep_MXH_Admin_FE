import React, { useState } from 'react'
import { GeminiModerationResult } from '../../types/ai'
import { aiService } from '../../services/aiService'
import { Sparkles, ShieldCheck, AlertTriangle, Play, HelpCircle } from 'lucide-react'

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
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#0866FF] dark:text-[#2D88FF]" />
          Kiểm tra trực tiếp nội dung bằng AI
        </h3>
        <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
          Nhập đoạn văn bản để kiểm tra phản hồi tức thì từ bộ lọc lai (Tầng 1 Fast Filter + Tầng 2 Gemini 1.5 Flash)
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung bài viết hoặc bình luận cần thử nghiệm kiểm duyệt..."
          className="w-full px-4 py-3 text-sm rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 focus:border-[#0866FF] resize-none transition-all"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[#65676B] dark:text-[#B0B3B8]">
            {content.length} ký tự
          </span>
          <button
            onClick={handleEvaluate}
            disabled={!content.trim() || isEvaluating}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0866FF] hover:bg-[#0055D6] disabled:opacity-50 rounded-xl shadow-xs transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            {isEvaluating ? 'Đang phân tích...' : 'Đánh giá bằng AI'}
          </button>
        </div>

        {error && (
          <div className="p-3.5 text-xs text-[#FA383E] bg-[#FA383E]/10 rounded-xl border border-[#FA383E]/20">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-5 p-5 rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5]/50 dark:bg-[#18191A]/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#65676B] dark:text-[#B0B3B8] mb-4">
              Kết quả đánh giá từ hệ thống AI
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-3 bg-white dark:bg-[#242526] rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs">
                <span className="text-[#65676B] dark:text-[#B0B3B8] font-medium">Điểm độc hại:</span>
                <p className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB] mt-0.5">
                  {Math.round((result.toxicityScore || 0) * 100)}%
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#242526] rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs">
                <span className="text-[#65676B] dark:text-[#B0B3B8] font-medium">Phân loại vi phạm:</span>
                <p className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB] mt-0.5">
                  {result.category || 'NONE'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#242526] rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs">
                <span className="text-[#65676B] dark:text-[#B0B3B8] font-medium">Mức độ cảnh báo:</span>
                <p className="text-sm font-bold text-[#050505] dark:text-[#E4E6EB] mt-0.5">
                  {result.severity || 'LOW'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#242526] rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs">
                <span className="text-[#65676B] dark:text-[#B0B3B8] font-medium">Hành động đề xuất:</span>
                <p className="text-sm font-bold text-[#0866FF] dark:text-[#2D88FF] mt-0.5">
                  {result.suggestedAction || 'ALLOW'}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#050505] dark:text-[#E4E6EB] bg-white dark:bg-[#242526] p-3 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B]">
              <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">Lý do nhận định: </span>
              <span className="text-[#65676B] dark:text-[#B0B3B8]">{result.reason || 'Nội dung phù hợp tiêu chuẩn'}</span>
            </div>

            {result.extractedKeywords && result.extractedKeywords.length > 0 && (
              <div className="mt-2.5 text-xs bg-white dark:bg-[#242526] p-3 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B]">
                <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">Từ khóa trích xuất: </span>
                <span className="text-[#0866FF] dark:text-[#2D88FF] font-semibold">{result.extractedKeywords.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default AiContentTester
