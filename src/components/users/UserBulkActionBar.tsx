import React from 'react'
import { CheckSquare, Bell, ShieldBan, X, Download } from 'lucide-react'
import Button from '../common/Button'

interface UserBulkActionBarProps {
  selectedCount: number
  totalCount: number
  onDeselectAll: () => void
  onBulkBan: () => void
  onBulkNotify: () => void
  onExportSelected: () => void
}

export const UserBulkActionBar: React.FC<UserBulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onDeselectAll,
  onBulkBan,
  onBulkNotify,
  onExportSelected,
}) => {
  if (selectedCount === 0) return null

  return (
    <div className="p-3.5 rounded-2xl bg-[#e7f3ff] dark:bg-[#0866ff]/15 border border-[#0866ff]/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-[#0866ff] dark:text-[#2d88ff]" />
        <span className="text-xs font-bold text-[#0866ff] dark:text-[#2d88ff]">
          Đã chọn {selectedCount} / {totalCount} thành viên
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
          leftIcon={<X className="w-3.5 h-3.5" />}
        >
          Bỏ chọn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkNotify}
          leftIcon={<Bell className="w-3.5 h-3.5" />}
        >
          Gửi thông báo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportSelected}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Xuất CSV ({selectedCount})
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onBulkBan}
          leftIcon={<ShieldBan className="w-3.5 h-3.5" />}
        >
          Khóa ({selectedCount})
        </Button>
      </div>
    </div>
  )
}

export default UserBulkActionBar

