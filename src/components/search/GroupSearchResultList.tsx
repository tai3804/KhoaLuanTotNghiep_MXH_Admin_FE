import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users2, Globe, Lock, Eye, Calendar, MessageSquare } from 'lucide-react'
import { Group } from '../../types/group'
import Avatar from '../common/Avatar'
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
              className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs hover:border-[#0866FF]/50 transition-all flex flex-col justify-between"
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
                      <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
                        {group.name}
                      </h4>
                      <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] flex items-center gap-1">
                        Quản trị viên:{' '}
                        <span className="font-semibold text-[#050505] dark:text-[#E4E6EB]">
                          {group.owner?.fullName || group.owner?.username || 'Hệ thống'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isPublic
                        ? 'text-[#31A24C] bg-emerald-50 dark:bg-emerald-500/10'
                        : 'text-[#65676B] dark:text-[#B0B3B8] bg-[#F0F2F5] dark:bg-[#3A3B3C]'
                    }`}
                  >
                    {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {isPublic ? 'Công khai' : 'Nhóm kín'}
                  </span>
                </div>

                {/* Description snippet */}
                <div className="bg-[#F0F2F5] dark:bg-[#18191A] p-3 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B]/40 mb-3">
                  <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] line-clamp-2 leading-relaxed">
                    {group.description || <span className="italic text-[#65676B] dark:text-[#B0B3B8]">Không có phần mô tả nhóm</span>}
                  </p>
                </div>
              </div>

              {/* Group stats & actions */}
              <div className="pt-2 border-t border-[#E4E6EB] dark:border-[#393A3B]/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#65676B] dark:text-[#B0B3B8]">
                  <span className="flex items-center gap-1">
                    <Users2 className="w-3.5 h-3.5 text-[#0866FF]" />
                    {group.membersCount || 0} thành viên
                  </span>
                  {group.postsCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#0866FF]" />
                      {group.postsCount} bài
                    </span>
                  )}
                  <span className="hidden sm:flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-[#65676B] dark:text-[#B0B3B8]" />
                    {group.createdAt ? new Date(group.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/groups')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0866FF] dark:text-[#2D88FF] bg-[#E7F3FF] dark:bg-[#0866FF]/20 hover:bg-[#0866FF] hover:text-white dark:hover:bg-[#0866FF] dark:hover:text-white transition-colors cursor-pointer"
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
        <div className="p-4 bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#65676B] dark:text-[#B0B3B8]">
            <span>Hiển thị mỗi trang:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-[#F0F2F5] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB] text-xs font-semibold px-2 py-1 rounded-lg border border-[#E4E6EB] dark:border-[#393A3B] cursor-pointer"
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

