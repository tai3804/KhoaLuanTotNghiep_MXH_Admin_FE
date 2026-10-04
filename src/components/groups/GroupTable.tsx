import React from 'react'
import { Trash2, Users, FileText, Lock, Globe } from 'lucide-react'
import { Group } from '../../types/group'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

export interface GroupTableProps {
  groups: Group[]
  isLoading?: boolean
  onDeleteClick: (group: Group) => void
}

export const GroupTable: React.FC<GroupTableProps> = ({
  groups,
  isLoading,
  onDeleteClick,
}) => {
  const columns: Column<Group>[] = [
    {
      header: 'Tên Hội Nhóm',
      cell: (group) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={group.avatarUrl}
            name={group.name}
            size="md"
            shape="rounded"
            type="group"
          />
          <div>
            <p className="font-bold text-[#050505] dark:text-[#E4E6EB]">
              {group.name}
            </p>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] line-clamp-1 max-w-xs">
              {group.description || 'Chưa có mô tả'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Quyền Riêng Tư',
      cell: (group) => (
        <Badge variant={group.privacy === 'PUBLIC' ? 'success' : 'neutral'} size="sm">
          {group.privacy === 'PUBLIC' ? (
            <Globe className="w-3 h-3 mr-1" />
          ) : (
            <Lock className="w-3 h-3 mr-1" />
          )}
          {group.privacy}
        </Badge>
      ),
    },
    {
      header: 'Trưởng Nhóm',
      cell: (group) => (
        <span className="text-xs font-semibold text-[#050505] dark:text-[#E4E6EB]">
          {group.owner?.fullName || group.owner?.username || 'Chưa rõ'}
        </span>
      ),
    },
    {
      header: 'Thống Kê',
      cell: (group) => (
        <div className="flex items-center gap-3 text-xs text-[#65676B] dark:text-[#B0B3B8]">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#0866FF]" />
            {group.membersCount.toLocaleString()} thành viên
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#0866FF]" />
            {group.postsCount ?? 0} bài
          </span>
        </div>
      ),
    },
    {
      header: 'Ngày Tạo',
      cell: (group) => (
        <span className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
          {group.createdAt ? new Date(group.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
        </span>
      ),
    },
    {
      header: 'Hành Động',
      className: 'text-right',
      cell: (group) => (
        <div className="flex items-center justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteClick(group)}
            title="Xóa nhóm vi phạm"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Giải Tán Nhóm
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={groups} isLoading={isLoading} />
}

export default GroupTable

