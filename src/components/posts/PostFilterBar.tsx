import React from 'react'
import { Search } from 'lucide-react'
import { PostFilter } from '../../types/post'

export interface PostFilterBarProps {
  filter: PostFilter
  onChange: (filter: Partial<PostFilter>) => void
}

export const PostFilterBar: React.FC<PostFilterBarProps> = ({
  filter,
  onChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#242526] p-4 rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs">
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-[#65676b] dark:text-[#b0b3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm nội dung bài viết, tác giả..."
          value={filter.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value, page: 1 })}
          className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs text-[#050505] dark:text-[#e4e6eb] pl-10 pr-4 py-2.5 rounded-xl outline-none border border-[#e4e6eb] dark:border-[#393a3b] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 transition-all placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8]"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={filter.privacy || 'ALL'}
          onChange={(e) => onChange({ privacy: e.target.value, page: 1 })}
          className="bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#0866ff] cursor-pointer"
        >
          <option value="ALL">Mọi Quyền Riêng Tư</option>
          <option value="PUBLIC">Công khai (Public)</option>
          <option value="FRIENDS">Bạn bè (Friends)</option>
          <option value="PRIVATE">Chỉ mình tôi (Private)</option>
        </select>
      </div>
    </div>
  )
}

export default PostFilterBar

