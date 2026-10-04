import React, { useState } from 'react'
import { Search, X, Filter, ArrowUpDown } from 'lucide-react'
import { SearchCategoryType } from './SearchCategoryPills'
import SearchAutocompleteDropdown from './SearchAutocompleteDropdown'

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  activeCategory: SearchCategoryType
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  onClearAll: () => void
  onSelectCategory?: (category: SearchCategoryType) => void
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onClearAll,
  onSelectCategory,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const getStatusOptions = () => {
    switch (activeCategory) {
      case 'USERS':
        return [
          { value: 'ALL', label: 'Tất cả trạng thái' },
          { value: 'ACTIVE', label: 'Đang hoạt động' },
          { value: 'BANNED', label: 'Đã bị khóa' },
          { value: 'PENDING_VERIFICATION', label: 'Chờ xác thực' },
        ]
      case 'POSTS':
        return [
          { value: 'ALL', label: 'Tất cả trạng thái' },
          { value: 'PUBLIC', label: 'Công khai (Public)' },
          { value: 'FRIENDS', label: 'Bạn bè' },
          { value: 'PRIVATE', label: 'Riêng tư' },
        ]
      case 'REPORTS':
        return [
          { value: 'ALL', label: 'Tất cả trạng thái' },
          { value: 'PENDING', label: 'Đang chờ xử lý' },
          { value: 'IN_PROGRESS', label: 'Đang giải quyết' },
          { value: 'RESOLVED', label: 'Đã xử lý xong' },
          { value: 'DISMISSED', label: 'Đã bác bỏ' },
        ]
      case 'GROUPS':
        return [
          { value: 'ALL', label: 'Tất cả quyền riêng tư' },
          { value: 'PUBLIC', label: 'Nhóm công khai' },
          { value: 'PRIVATE', label: 'Nhóm kín' },
        ]
      default:
        return [
          { value: 'ALL', label: 'Tất cả trạng thái / loại' },
          { value: 'ACTIVE', label: 'Hoạt động / Hợp lệ' },
          { value: 'PENDING', label: 'Đang chờ duyệt' },
          { value: 'BANNED', label: 'Bị khóa / Vi phạm' },
        ]
    }
  }

  const statusOptions = getStatusOptions()

  const handleSelectSuggestion = (kw: string, cat?: string) => {
    onSearchChange(kw)
    setIsDropdownOpen(false)
    if (cat && onSelectCategory) {
      onSelectCategory(cat as SearchCategoryType)
    }
  }

  return (
    <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#65676B] dark:text-[#B0B3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setIsDropdownOpen(true)
            }}
            placeholder="Nhập tên người dùng, email, từ khóa bài viết, lý do báo cáo, tên nhóm..."
            className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] placeholder:text-[#65676B] dark:placeholder:text-[#B0B3B8] text-xs font-semibold pl-10 pr-9 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:border-[#0866FF] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('')
                setIsDropdownOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[#65676B] hover:text-[#050505] dark:hover:text-[#E4E6EB] transition-colors cursor-pointer"
              title="Xóa ô tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete suggestions dropdown */}
          <SearchAutocompleteDropdown
            query={searchQuery}
            isOpen={isDropdownOpen}
            onSelect={handleSelectSuggestion}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>

        {/* Dynamic Status / Type Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-44">
            <Filter className="w-3.5 h-3.5 text-[#65676B] dark:text-[#B0B3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full appearance-none bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] text-xs font-semibold pl-9 pr-8 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:border-[#0866FF] transition-all cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#242526]">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#65676B] dark:text-[#B0B3B8] text-[10px]">
              ▼
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-36">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#65676B] dark:text-[#B0B3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full appearance-none bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#050505] dark:text-[#E4E6EB] text-xs font-semibold pl-8 pr-7 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:border-[#0866FF] transition-all cursor-pointer"
            >
              <option value="NEWEST" className="bg-white dark:bg-[#242526]">Mới nhất</option>
              <option value="OLDEST" className="bg-white dark:bg-[#242526]">Cũ nhất</option>
              <option value="POPULAR" className="bg-white dark:bg-[#242526]">Nổi bật nhất</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#65676B] dark:text-[#B0B3B8] text-[10px]">
              ▼
            </div>
          </div>

          {(searchQuery || statusFilter !== 'ALL') && (
            <button
              onClick={onClearAll}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[#FA383E] hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 transition-colors whitespace-nowrap cursor-pointer"
              title="Đặt lại tất cả bộ lọc"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchFilterBar

