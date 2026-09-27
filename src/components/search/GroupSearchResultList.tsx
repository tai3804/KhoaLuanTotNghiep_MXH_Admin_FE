import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users2, Globe, Lock, Eye, Calendar, MessageSquare } from 'lucide-react'
import { Group } from '../../types/group'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Pagination from '../common/Pagination'

interface GroupSearchResultListProps {
  groups: Group[]
}

export const GroupSearchResultList: React.FC<GroupSearchResultListProps> = ({ groups }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [groups.length])

  const paginatedGroups = groups.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedGroups.map((group) => {
          const isPublic = group.privacy === 'PUBLIC'
          return (
            <div
              key={group.id}
              className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-slate-200 dark:border-[#393a3b] shadow-xs hover:border-[#1877f2]/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Group info & privacy */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={group.avatarUrl || group.coverUrl}
                      name={group.name}
                      size="md"
                      shape="rounded"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-[#e4e6eb] truncate">
                        {group.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-[#b0b3b8] flex items-center gap-1">
                        Quản trị viên:{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {group.owner?.fullName || group.owner?.username || 'Hệ thống'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isPublic
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'text-slate-600 dark:text-[#b0b3b8] bg-slate-100 dark:bg-[#3a3b3c]'
                    }`}
                  >
                    {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {isPublic ? 'Công khai' : 'Nhóm kín'}
                  </span>
                </div>

                {/* Description snippet */}
                <div className="bg-slate-50 dark:bg-[#1c1e21] p-3 rounded-xl border border-slate-100 dark:border-[#393a3b]/40 mb-3">
                  <p className="text-xs text-slate-600 dark:text-[#b0b3b8] line-clamp-2 leading-relaxed">
                    {group.description || <span className="italic text-slate-400">Không có phần mô tả nhóm</span>}
                  </p>
                </div>
              </div>

              {/* Group stats & actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#393a3b]/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#b0b3b8]">
                  <span className="flex items-center gap-1">
                    <Users2 className="w-3.5 h-3.5 text-indigo-500" />
                    {group.membersCount || 0} thành viên
                  </span>
                  {group.postsCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
                      {group.postsCount} bài
                    </span>
                  )}
                  <span className="hidden sm:flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {group.createdAt ? new Date(group.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/groups')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem nhóm</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Footer */}
      {groups.length > 0 && (
        <div className="p-4 bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#393a3b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#b0b3b8]">
            <span>Hiển thị mỗi trang:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-slate-50 dark:bg-[#18191a] text-slate-800 dark:text-[#e4e6eb] text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-[#393a3b] cursor-pointer"
            >
              <option value={4}>4 nhóm</option>
              <option value={8}>8 nhóm</option>
              <option value={16}>16 nhóm</option>
              <option value={32}>32 nhóm</option>
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={groups.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

export default GroupSearchResultList
