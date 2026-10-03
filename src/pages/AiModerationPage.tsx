import React, { useState, useEffect, useCallback } from 'react'
import { aiService } from '../services/aiService'
import { AiStats, AiModerationLog, SensitiveKeyword } from '../types/ai'
import { useAppDispatch } from '../store'
import { addToast } from '../store/slices/toastSlice'
import AiStatsOverview from '../components/ai-moderation/AiStatsOverview'
import AiLogsTable from '../components/ai-moderation/AiLogsTable'
import AiKeywordsManager from '../components/ai-moderation/AiKeywordsManager'
import AiContentTester from '../components/ai-moderation/AiContentTester'

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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Kiểm duyệt tự động AI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Hệ thống kiểm duyệt đa tầng kết hợp bộ lọc siêu tốc và trí tuệ nhân tạo Gemini 1.5 Flash
        </p>
      </div>

      {/* Stats Overview */}
      <AiStatsOverview stats={stats} isLoading={isStatsLoading} />

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Nhật ký kiểm duyệt ({logsTotalElements.toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'keywords'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Từ điển & AI tự học ({kwTotalElements.toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tester'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
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
