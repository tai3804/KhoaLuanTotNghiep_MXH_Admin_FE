import React from 'react'
import { Search } from 'lucide-react'
import { UserFilter } from '../../types/user'

export interface UserFilterBarProps {
  filter: UserFilter
  onChange: (filter: Partial<UserFilter>) => void
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  filter,
  onChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#242526] p-4 rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs">
      {/* Search by name/email/username */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-[#65676b] dark:text-[#b0b3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm theo Tên, Email hoặc Username..."
          value={filter.searchQuery}
          onChange={(e) => onChange({ searchQuery: e.target.value, page: 1 })}
          className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs text-[#050505] dark:text-[#e4e6eb] pl-10 pr-4 py-2.5 rounded-xl outline-none border border-[#e4e6eb] dark:border-[#393a3b] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 transition-all placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8]"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Filter by Status */}
        <select
          value={filter.status || 'ALL'}
          onChange={(e) => onChange({ status: e.target.value as any, page: 1 })}
          className="bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#0866ff] cursor-pointer"
        >
          <option value="ALL">Tất cả Trạng thái</option>
          <option value="ACTIVE">Hoạt động (Active)</option>
          <option value="BANNED">Đã bị khóa (Banned)</option>
          <option value="PENDING_VERIFICATION">Chờ xác thực</option>
        </select>

        {/* Filter by Role */}
        <select
          value={filter.role || 'ALL'}
          onChange={(e) => onChange({ role: e.target.value as any, page: 1 })}
          className="bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#0866ff] cursor-pointer"
        >
          <option value="ALL">Tất cả Vai trò</option>
          <option value="USER">User thường</option>
          <option value="MODERATOR">Moderator</option>
          <option value="ADMIN">Quản trị viên (Admin)</option>
        </select>
      </div>
    </div>
  )
}

export default UserFilterBar

