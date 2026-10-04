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
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-md w-1/3" />
        <div className="h-48 bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 rounded-xl" />
      </div>
    )
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-[#F5C33B] text-black font-black text-xs flex items-center justify-center shadow-xs">
          1
        </span>
      )
    }
    if (rank === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-[#CED0D4] text-[#050505] font-black text-xs flex items-center justify-center shadow-xs">
          2
        </span>
      )
    }
    if (rank === 3) {
      return (
        <span className="w-6 h-6 rounded-full bg-[#B78103] text-white font-black text-xs flex items-center justify-center shadow-xs">
          3
        </span>
      )
    }
    return (
      <span className="w-6 h-6 rounded-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] font-bold text-xs flex items-center justify-center">
        {rank}
      </span>
    )
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E7F3FF] dark:bg-[#0866FF]/20 flex items-center justify-center text-[#0866FF]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
              Xu Hướng & Hashtag Thịnh Hành (Trending Topics)
            </h3>
          </div>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Theo dõi chủ đề được cộng đồng bàn luận nhiều nhất trong thời gian thực
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#65676B] dark:text-[#B0B3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm hashtag..."
            className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] pl-9 pr-3 py-2 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:border-[#0866FF] transition-all"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-[#65676B] dark:text-[#B0B3B8] flex items-center gap-1 shrink-0 mr-1">
          <Layers className="w-3.5 h-3.5" /> Chủ đề:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0866FF] text-white shadow-xs'
                : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] hover:bg-[#E4E6EB] dark:hover:bg-[#4E4F50]'
            }`}
          >
            {cat === 'ALL' ? 'Tất cả' : cat}
          </button>
        ))}
      </div>

      {/* Hashtag List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F0F2F5] dark:bg-[#18191A] uppercase text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] border-b border-[#E4E6EB] dark:border-[#393A3B]">
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
          <tbody className="divide-y divide-[#E4E6EB] dark:divide-[#393A3B]">
            {filteredHashtags.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#65676B] dark:text-[#B0B3B8]">
                  Không tìm thấy hashtag nào phù hợp với bộ lọc
                </td>
              </tr>
            ) : (
              filteredHashtags.map((item) => (
                <tr
                  key={item.tag}
                  className="hover:bg-[#F0F2F5]/80 dark:hover:bg-[#3A3B3C]/40 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex justify-center">{getRankBadge(item.rank)}</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#0866FF] text-sm">
                    <div className="flex items-center gap-1.5 group-hover:underline cursor-pointer">
                      <Hash className="w-4 h-4 text-[#0866FF]/70" />
                      <span>{item.tag.replace(/^#/, '')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#050505] dark:text-[#E4E6EB]">
                    {item.postCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#31A24C]">
                    <div className="flex items-center justify-end gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{item.growthPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[#65676B] dark:text-[#B0B3B8]">
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
        <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-[#F5C33B]" />
          Đám Mây Từ Khóa Nổi Bật (Tag Cloud)
        </h4>
        {hashtags.length === 0 ? (
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] italic">Chưa có hashtag hoặc từ khóa nổi bật trong các bài viết.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, i) => (
              <button
                key={h.tag}
                onClick={() => setSearch(h.tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  i === 0
                    ? 'bg-amber-500/15 text-[#B78103] dark:text-[#F5C33B] border border-amber-500/30 text-sm'
                    : i <= 2
                    ? 'bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] border border-[#0866FF]/30'
                    : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] hover:bg-[#E7F3FF] hover:text-[#0866FF]'
                }`}
              >
                {h.tag} <span className="text-[10px] opacity-70">({h.postCount})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendingHashtags

