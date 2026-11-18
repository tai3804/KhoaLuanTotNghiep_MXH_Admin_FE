import React, { useEffect, useState } from 'react'
import { Flame, Layers, Users } from 'lucide-react'
import api from '../../services/api'

interface TrendingTopic {
  id: number
  posts: number
  previousPosts: number
  growthPercent: number
  burstScore: number
  trending: boolean
  engagement: number
  authors: number
  cohesion: number
  hashtags: string[]
  representativeSnippet: string
}

interface TrendingTopicsReport {
  days: number
  totalPosts: number
  k: number
  silhouette: number
  topics: TrendingTopic[]
}

/**
 * Chủ đề đang nổi, gom cụm theo embedding (k-means cầu, k chọn bằng silhouette) và đo mức tăng so với cửa sổ liền trước.
 * Bổ sung cho bảng hashtag: bắt được các bài cùng chủ đề nhưng dùng từ ngữ/hashtag khác nhau.
 */
export const TrendingTopics: React.FC = () => {
  const [report, setReport] = useState<TrendingTopicsReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .get('/api/v1/posts/admin/trending-topics', { params: { days } })
      .then((res) => {
        if (!cancelled) setReport(res.data?.data ?? res.data ?? null)
      })
      .catch(() => {
        if (!cancelled) setReport(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [days])

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#1877F2]" />
          <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">Chủ đề đang nổi (gom cụm theo ngữ nghĩa)</h3>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-sm rounded-lg border border-[#CED0D4] dark:border-[#393A3B] bg-white dark:bg-[#3A3B3C] px-2 py-1 text-[#050505] dark:text-[#E4E6EB]"
        >
          <option value={3}>3 ngày</option>
          <option value={7}>7 ngày</option>
          <option value={14}>14 ngày</option>
          <option value={30}>30 ngày</option>
        </select>
      </div>

      {loading ? (
        <div className="h-32 rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 animate-pulse" />
      ) : !report || report.topics.length === 0 ? (
        <p className="text-sm text-[#65676B] dark:text-[#B0B3B8]">
          Chưa đủ bài viết có vector ngữ nghĩa trong {days} ngày gần đây để gom cụm chủ đề.
        </p>
      ) : (
        <>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
            {report.totalPosts} bài · {report.k} chủ đề · silhouette {report.silhouette.toFixed(2)} (càng gần 1 thì các chủ đề càng tách bạch)
          </p>
          <ul className="space-y-3">
            {report.topics.map((t) => (
              <li
                key={t.id}
                className="rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] p-4 flex flex-col gap-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {t.trending && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E6] text-[#D9480F] px-2 py-0.5 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5" /> Bùng nổ
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#050505] dark:text-[#E4E6EB]">
                    {t.hashtags.length > 0 ? t.hashtags.join(' ') : `Chủ đề ${t.id + 1}`}
                  </span>
                </div>
                <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] line-clamp-2">“{t.representativeSnippet}”</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  <span>
                    {t.posts} bài (trước đó {t.previousPosts})
                  </span>
                  <span>
                    {t.growthPercent >= 0 ? '+' : ''}
                    {t.growthPercent}%
                  </span>
                  <span>điểm bùng nổ {t.burstScore}</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {t.authors} tác giả
                  </span>
                  <span>tương tác {t.engagement}</span>
                  <span>độ cô đặc {t.cohesion.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default TrendingTopics
