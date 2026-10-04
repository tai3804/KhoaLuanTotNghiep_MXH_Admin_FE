import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search,
  FileText,
  ShieldAlert,
  Users2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react'
import { useAppSelector } from '../../store'
import Avatar from '../common/Avatar'
import {
  getSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
} from '../../utils/searchHistory'

interface SuggestionItem {
  id: string
  title: string
  subtitle?: string
  category: 'USER' | 'POST' | 'REPORT' | 'GROUP' | 'KEYWORD' | 'HISTORY'
  icon: React.ReactNode
  keyword: string
  catParam?: string
}

interface SearchAutocompleteDropdownProps {
  query: string
  isOpen: boolean
  onSelect: (keyword: string, catParam?: string) => void
  onClose: () => void
}

export const SearchAutocompleteDropdown: React.FC<SearchAutocompleteDropdownProps> = ({
  query,
  isOpen,
  onSelect,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const users = useAppSelector((state) => state.user.users)
  const posts = useAppSelector((state) => state.post.posts)
  const reports = useAppSelector((state) => state.report.reports)
  const groups = useAppSelector((state) => state.group.groups)

  const [historyList, setHistoryList] = useState<string[]>([])

  // Load history whenever dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHistoryList(getSearchHistory())
    }
  }, [isOpen])

  // Hot suggested topics
  const defaultSuggestions = [
    { label: 'Tài khoản Quản trị viên (Admin)', keyword: 'admin', cat: 'USERS' },
    { label: 'Báo cáo vi phạm SPAM', keyword: 'SPAM', cat: 'REPORTS' },
    { label: 'Báo cáo nội dung thù ghét', keyword: 'HATE_SPEECH', cat: 'REPORTS' },
    { label: 'Hội nhóm công khai', keyword: 'PUBLIC', cat: 'GROUPS' },
    { label: 'Tài khoản đang bị khóa', keyword: 'BANNED', cat: 'USERS' },
  ]

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleRemoveHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation()
    const updated = removeSearchHistoryItem(item)
    setHistoryList(updated)
  }

  const handleClearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearSearchHistory()
    setHistoryList([])
  }

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return []
    }

    const items: SuggestionItem[] = []

    // 1. Matched history items (up to 2)
    historyList
      .filter((h) => h.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((h, idx) => {
        items.push({
          id: `h-${idx}-${h}`,
          title: h,
          subtitle: 'Lịch sử tìm kiếm gần đây',
          category: 'HISTORY',
          icon: <Clock className="w-3.5 h-3.5 text-[#65676B] dark:text-[#B0B3B8]" />,
          keyword: h,
        })
      })

    // 2. Matched Users (up to 3)
    users
      .filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .forEach((u) => {
        items.push({
          id: `u-${u.id || u.userId}`,
          title: u.fullName || u.username,
          subtitle: `@${u.username} • ${u.email || u.role}`,
          category: 'USER',
          icon: <Avatar src={u.avatarUrl} name={u.fullName || u.username} size="xs" shape="rounded" />,
          keyword: u.fullName || u.username,
          catParam: 'USERS',
        })
      })

    // 3. Matched Posts (up to 2)
    posts
      .filter(
        (p) =>
          p.content?.toLowerCase().includes(q) ||
          p.author?.fullName?.toLowerCase().includes(q)
      )
      .slice(0, 2)
      .forEach((p) => {
        items.push({
          id: `p-${p.id}`,
          title: p.content.slice(0, 45) + (p.content.length > 45 ? '...' : ''),
          subtitle: `Bởi ${p.author?.fullName || 'Người dùng'} • ${p.likesCount || 0} thích`,
          category: 'POST',
          icon: <FileText className="w-3.5 h-3.5 text-[#31A24C]" />,
          keyword: p.content.slice(0, 30),
          catParam: 'POSTS',
        })
      })

    // 4. Matched Reports (up to 2)
    reports
      .filter(
        (r) =>
          r.reason?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      )
      .slice(0, 2)
      .forEach((r) => {
        items.push({
          id: `r-${r.id}`,
          title: `Báo cáo: ${r.reason}`,
          subtitle: `${r.description?.slice(0, 40) || 'Không có mô tả'} • ${r.status}`,
          category: 'REPORT',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-[#FA383E]" />,
          keyword: r.reason,
          catParam: 'REPORTS',
        })
      })

    // 5. Matched Groups (up to 2)
    groups
      .filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q)
      )
      .slice(0, 2)
      .forEach((g) => {
        items.push({
          id: `g-${g.id}`,
          title: g.name,
          subtitle: `${g.membersCount || 0} thành viên • ${g.privacy}`,
          category: 'GROUP',
          icon: <Users2 className="w-3.5 h-3.5 text-cyan-500" />,
          keyword: g.name,
          catParam: 'GROUPS',
        })
      })

    return items
  }, [query, users, posts, reports, groups, historyList])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-[#E4E6EB] dark:border-[#393A3B] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 min-w-80 sm:min-w-96 max-h-[80vh] overflow-y-auto"
    >
      {/* If search query is empty: show Recent Search History & Popular Suggestions */}
      {!query.trim() ? (
        <div className="p-3 space-y-3 divide-y divide-[#E4E6EB] dark:divide-[#393A3B]/50">
          {/* Recent Search History */}
          {historyList.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#0866FF]" />
                  <span>Lịch sử tìm kiếm gần đây</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="text-[10px] font-semibold text-[#FA383E] hover:underline cursor-pointer lowercase"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-0.5">
                {historyList.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      onSelect(item)
                      onClose()
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#050505] dark:text-[#E4E6EB] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-[#65676B] dark:text-[#B0B3B8] group-hover:text-[#0866FF] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleRemoveHistoryItem(e, item)}
                      className="p-1 rounded-md text-[#65676B] dark:text-[#B0B3B8] hover:text-[#FA383E] hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Xóa khỏi lịch sử"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hot / Popular Suggestions */}
          <div className={historyList.length > 0 ? 'pt-3 space-y-1' : 'space-y-1'}>
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F5C33B]" />
              <span>Gợi ý tìm kiếm phổ biến</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {defaultSuggestions.map((item) => (
                <button
                  key={item.keyword}
                  type="button"
                  onClick={() => {
                    onSelect(item.keyword, item.cat)
                    onClose()
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#050505] dark:text-[#E4E6EB] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#65676B] dark:text-[#B0B3B8] group-hover:text-[#0866FF]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] group-hover:text-[#0866FF]">
                    Tìm kiếm ↵
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : suggestions.length === 0 ? (
        /* No quick match */
        <div className="p-4 text-center">
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
            Nhấn <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-[#F0F2F5] dark:bg-[#18191A] rounded">Enter</kbd> để tìm kiếm toàn bộ hệ thống cho:
          </p>
          <button
            type="button"
            onClick={() => {
              onSelect(query.trim())
              onClose()
            }}
            className="mt-2 text-xs font-bold text-[#0866FF] dark:text-[#2D88FF] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            "{query}" <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Real-time matched suggestions */
        <div className="p-2 divide-y divide-[#E4E6EB] dark:divide-[#393A3B]/50">
          <div className="pb-2 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider flex items-center justify-between">
              <span>Kết quả nhanh phù hợp</span>
              <span>{suggestions.length} gợi ý</span>
            </div>
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.keyword, item.catParam)
                  onClose()
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] flex items-center justify-between gap-3 group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#F0F2F5] dark:bg-[#18191A] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate group-hover:text-[#0866FF] transition-colors">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F0F2F5] dark:bg-[#18191A] text-[#65676B] dark:text-[#B0B3B8]">
                    {item.category === 'USER'
                      ? 'Tài khoản'
                      : item.category === 'POST'
                      ? 'Bài viết'
                      : item.category === 'REPORT'
                      ? 'Báo cáo'
                      : item.category === 'GROUP'
                      ? 'Hội nhóm'
                      : 'Lịch sử'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Jump to full search page button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onSelect(query.trim())
                onClose()
              }}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#0866FF] dark:text-[#2D88FF] hover:bg-[#E7F3FF] dark:hover:bg-[#0866FF]/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Xem tất cả kết quả cho "{query}"</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAutocompleteDropdown

