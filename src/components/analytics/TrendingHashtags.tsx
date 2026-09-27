import React, { useState } from 'react'
import {
  TrendingUp,
  Hash,
  Search,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowUpRight,
} from 'lucide-react'
import { TrendingHashtag } from '../../types/analytics'
import Badge from '../common/Badge'

interface TrendingHashtagsProps {
  hashtags: TrendingHashtag[]
  isLoading?: boolean
}

export const TrendingHashtags: React.FC<TrendingHashtagsProps> = ({
  hashtags,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const categories = [
    'ALL',
    ...Array.from(new Set(hashtags.map((h) => h.category))),
  ]

  const filteredHashtags = hashtags.filter((item) => {
    const matchesSearch =
      item.tag.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3" />
        <div className="h-48 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
      </div>
    )
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/30">
          1
        </span>
      )
    }
    if (rank === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-slate-400 text-white font-black text-xs flex items-center justify-center shadow-sm">
          2
        </span>
      )
    }
    if (rank === 3) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
          3
        </span>
      )
    }
    return (
      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center">
        {rank}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Xu Hướng & Hashtag Thịnh Hành (Trending Topics)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi chủ đề được cộng đồng bàn luận nhiều nhất trong thời gian thực
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm hashtag..."
            className="w-full bg-slate-50 dark:bg-[#1c1e21] text-xs text-slate-900 dark:text-white pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Layers className="w-3.5 h-3.5" /> Chủ đề:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1877f2] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat === 'ALL' ? 'Tất cả' : cat}
          </button>
        ))}
      </div>

      {/* Hashtag List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-[#18191a]/80 uppercase text-[11px] font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 w-14 text-center">Hạng</th>
              <th className="px-4 py-3">Hashtag / Chủ đề</th>
              <th className="px-4 py-3">Chuyên mục</th>
              <th className="px-4 py-3 text-right">Bài viết</th>
              <th className="px-4 py-3 text-right">Tăng trưởng</th>
              <th className="px-4 py-3 text-right">Tương tác</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredHashtags.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Không tìm thấy hashtag nào phù hợp với bộ lọc
                </td>
              </tr>
            ) : (
              filteredHashtags.map((item) => (
                <tr
                  key={item.tag}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">{getRankBadge(item.rank)}</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    <div className="flex items-center gap-1.5 group-hover:underline cursor-pointer">
                      <Hash className="w-4 h-4 text-indigo-500/70" />
                      <span>{item.tag.replace(/^#/, '')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                    {item.postCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    <div className="flex items-center justify-end gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{item.growthPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-600 dark:text-slate-300">
                    {item.engagementScore.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {item.status === 'VIRAL' ? (
                      <Badge variant="warning" size="sm" dot>
                        Bùng nổ (Viral)
                      </Badge>
                    ) : item.status === 'REVIEW' ? (
                      <Badge variant="danger" size="sm" dot>
                        Cần xem xét
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm" dot>
                        An toàn
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Tag Cloud */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Đám Mây Từ Khóa Nổi Bật (Tag Cloud)
        </h4>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((h, i) => (
            <button
              key={h.tag}
              onClick={() => setSearch(h.tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                i === 0
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-sm'
                  : i <= 2
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600'
              }`}
            >
              {h.tag} <span className="text-[10px] opacity-70">({h.postCount})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendingHashtags
