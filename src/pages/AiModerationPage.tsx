import React, { useState, useEffect, useCallback } from 'react'
import { aiService } from '../services/aiService'
import { AiStats, AiModerationLog, SensitiveKeyword } from '../types/ai'
import { useAppDispatch } from '../store'
import { addToast } from '../store/slices/toastSlice'
import AiStatsOverview from '../components/ai-moderation/AiStatsOverview'
import AiLogsTable from '../components/ai-moderation/AiLogsTable'
import AiKeywordsManager from '../components/ai-moderation/AiKeywordsManager'
import AiContentTester from '../components/ai-moderation/AiContentTester'
import { Sparkles, FileText, BookOpen, Cpu } from 'lucide-react'

export const AiModerationPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const [activeTab, setActiveTab] = useState<'logs' | 'keywords' | 'tester'>('logs')

  // Stats state
  const [stats, setStats] = useState<AiStats | null>(null)
  const [isStatsLoading, setIsStatsLoading] = useState(false)

  // Logs state
  const [logs, setLogs] = useState<AiModerationLog[]>([])
  const [logsPage, setLogsPage] = useState(0)
  const [logsTotalPages, setLogsTotalPages] = useState(1)
  const [logsTotalElements, setLogsTotalElements] = useState(0)
  const [isLogsLoading, setIsLogsLoading] = useState(false)

  // Keywords state
  const [keywords, setKeywords] = useState<SensitiveKeyword[]>([])
  const [kwPage, setKwPage] = useState(0)
  const [kwTotalPages, setKwTotalPages] = useState(1)
  const [kwTotalElements, setKwTotalElements] = useState(0)
  const [isKwLoading, setIsKwLoading] = useState(false)

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true)
    try {
      const data = await aiService.getStats()
      setStats(data)
    } catch (e) {
      console.warn('Could not load AI stats:', e)
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  const fetchLogs = useCallback(async (page: number) => {
    setIsLogsLoading(true)
    try {
      const data = await aiService.getLogs(page, 15)
      setLogs(data.content)
      setLogsTotalPages(data.totalPages)
      setLogsTotalElements(data.totalElements)
      setLogsPage(page)
    } catch (e) {
      console.warn('Could not load AI logs:', e)
    } finally {
      setIsLogsLoading(false)
    }
  }, [])

  const fetchKeywords = useCallback(async (page: number) => {
    setIsKwLoading(true)
    try {
      const data = await aiService.getKeywords({ page, size: 15 })
      setKeywords(data.content)
      setKwTotalPages(data.totalPages)
      setKwTotalElements(data.totalElements)
      setKwPage(page)
    } catch (e) {
      console.warn('Could not load AI keywords:', e)
    } finally {
      setIsKwLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchLogs(0)
    fetchKeywords(0)
  }, [fetchStats, fetchLogs, fetchKeywords])

  const handleApproveKeyword = async (id: string) => {
    try {
      await aiService.approveKeyword(id)
      dispatch(
        addToast({
          type: 'success',
          title: 'Đã duyệt',
          message: 'Từ khóa do AI tự học đã được phê duyệt thành công.',
        })
      )
      fetchKeywords(kwPage)
      fetchStats()
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể phê duyệt từ khóa.',
        })
      )
    }
  }

  const handleAddKeyword = async (data: {
    keyword: string
    category?: string
    severity?: string
  }) => {
    try {
      await aiService.addKeyword(data)
      dispatch(
        addToast({
          type: 'success',
          title: 'Đã thêm',
          message: `Từ khóa "${data.keyword}" đã được thêm vào bộ lọc AI.`,
        })
      )
      fetchKeywords(0)
      fetchStats()
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể thêm từ khóa này.',
        })
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2.5">
          <Cpu className="w-7 h-7 text-[#0866FF] dark:text-[#2D88FF]" />
          Kiểm duyệt tự động AI
        </h1>
        <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
          Hệ thống kiểm duyệt đa tầng kết hợp bộ lọc siêu tốc và trí tuệ nhân tạo Gemini AI
        </p>
      </div>

      {/* Stats Overview */}
      <AiStatsOverview stats={stats} isLoading={isStatsLoading} />

      {/* Tabs */}
      <div className="border-b border-[#E4E6EB] dark:border-[#393A3B]">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-[#0866FF] text-[#0866FF] dark:border-[#2D88FF] dark:text-[#2D88FF]'
                : 'border-transparent text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Nhật ký kiểm duyệt ({logsTotalElements.toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex items-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'keywords'
                ? 'border-[#0866FF] text-[#0866FF] dark:border-[#2D88FF] dark:text-[#2D88FF]'
                : 'border-transparent text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Từ điển & AI tự học ({kwTotalElements.toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`flex items-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'tester'
                ? 'border-[#0866FF] text-[#0866FF] dark:border-[#2D88FF] dark:text-[#2D88FF]'
                : 'border-transparent text-[#65676B] hover:text-[#050505] dark:text-[#B0B3B8] dark:hover:text-[#E4E6EB]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Thử nghiệm đánh giá trực tiếp
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === 'logs' && (
        <AiLogsTable
          logs={logs}
          isLoading={isLogsLoading}
          currentPage={logsPage}
          totalPages={logsTotalPages}
          totalElements={logsTotalElements}
          onPageChange={(p) => fetchLogs(p)}
        />
      )}

      {activeTab === 'keywords' && (
        <AiKeywordsManager
          keywords={keywords}
          isLoading={isKwLoading}
          currentPage={kwPage}
          totalPages={kwTotalPages}
          totalElements={kwTotalElements}
          onPageChange={(p) => fetchKeywords(p)}
          onApprove={handleApproveKeyword}
          onAdd={handleAddKeyword}
        />
      )}

      {activeTab === 'tester' && <AiContentTester />}
    </div>
  )
}
export default AiModerationPage
