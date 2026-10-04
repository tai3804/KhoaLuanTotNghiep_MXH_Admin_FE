import React from 'react'
import { UserPlus, Bell, Download } from 'lucide-react'
import Button from '../common/Button'

interface UserPageHeaderProps {
  onOpenBroadcast: () => void
  onExportCsv: () => void
  onOpenCreateModal: () => void
}

export const UserPageHeader: React.FC<UserPageHeaderProps> = ({
  onOpenBroadcast,
  onExportCsv,
  onOpenCreateModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-[#050505] dark:text-[#e4e6eb] tracking-tight">
          Quản Lý Người Dùng & Phân Quyền
        </h2>
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-1">
          Xem danh sách tài khoản, hồ sơ thành viên, cấp quyền Admin/Moderator và quản lý bảo mật
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenBroadcast}
          leftIcon={<Bell className="w-4 h-4" />}
        >
          Gửi Thông Báo Hệ Thống
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportCsv}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Xuất Báo Cáo CSV
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCreateModal}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          + Thêm Tài Khoản Mới
        </Button>
      </div>
    </div>
  )
}

export default UserPageHeader

