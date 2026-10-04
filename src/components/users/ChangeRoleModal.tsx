import React, { useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

export interface ChangeRoleModalProps {
  user: User | null
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onConfirm: (userId: string, newRole: string) => Promise<void>
}

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  user,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'MODERATOR' | 'USER'>(
    (user?.role as any) || 'USER'
  )

  React.useEffect(() => {
    if (user?.role) {
      setSelectedRole((user.role as any) || 'USER')
    }
  }, [user])

  if (!user) return null

  const handleSave = async () => {
    await onConfirm(user.id, selectedRole)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Phân Quyền Vai Trò Thành Viên"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* User Card */}
        <div className="p-3.5 bg-[#f0f2f5] dark:bg-[#18191a] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-3">
          <Avatar
            src={user.avatarUrl}
            name={user.fullName || user.username}
            size="lg"
            shape="rounded"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[#050505] dark:text-[#e4e6eb] text-sm truncate">
              {user.fullName}
            </h4>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">@{user.username} • {user.email}</p>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-1">
              Vai trò hiện tại: <span className="font-bold text-[#0866ff]">{user.role}</span>
            </p>
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
            Chọn Vai Trò Mới
          </label>

          {/* ADMIN */}
          <div
            onClick={() => setSelectedRole('ADMIN')}
            className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
              selectedRole === 'ADMIN'
                ? 'border-[#0866ff] bg-[#e7f3ff] dark:bg-[#0866ff]/15 ring-2 ring-[#0866ff]/20 shadow-xs'
                : 'border-[#e4e6eb] dark:border-[#393a3b] hover:border-[#bcc0c4] dark:hover:border-[#4e4f50] bg-white dark:bg-[#242526]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#e7f3ff] dark:bg-[#0866ff]/20 text-[#0866ff] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">ADMIN (Quản Trị Viên)</p>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                  Toàn quyền quản trị, bảo mật & hệ thống
                </p>
              </div>
            </div>
            {selectedRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#0866ff]" />}
          </div>

          {/* MODERATOR */}
          <div
            onClick={() => setSelectedRole('MODERATOR')}
            className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
              selectedRole === 'MODERATOR'
                ? 'border-[#f5c33b] bg-[#fff8e1] dark:bg-[#f5c33b]/15 ring-2 ring-[#f5c33b]/20 shadow-xs'
                : 'border-[#e4e6eb] dark:border-[#393a3b] hover:border-[#bcc0c4] dark:hover:border-[#4e4f50] bg-white dark:bg-[#242526]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fff8e1] dark:bg-[#f5c33b]/20 text-[#b78103] dark:text-[#f5c33b] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">MODERATOR (Kiểm Duyệt Viên)</p>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                  Kiểm duyệt bài viết, bình luận & xử lý báo cáo vi phạm
                </p>
              </div>
            </div>
            {selectedRole === 'MODERATOR' && <CheckCircle2 className="w-4 h-4 text-[#f5c33b]" />}
          </div>

          {/* USER */}
          <div
            onClick={() => setSelectedRole('USER')}
            className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
              selectedRole === 'USER'
                ? 'border-[#31a24c] bg-[#e7f8ed] dark:bg-[#31a24c]/15 ring-2 ring-[#31a24c]/20 shadow-xs'
                : 'border-[#e4e6eb] dark:border-[#393a3b] hover:border-[#bcc0c4] dark:hover:border-[#4e4f50] bg-white dark:bg-[#242526]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#e7f8ed] dark:bg-[#31a24c]/20 text-[#31a24c] flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">USER (Thành Viên Thường)</p>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                  Người dùng mạng xã hội thông thường
                </p>
              </div>
            </div>
            {selectedRole === 'USER' && <CheckCircle2 className="w-4 h-4 text-[#31a24c]" />}
          </div>
        </div>

        {/* Note */}
        <div className="p-3 bg-[#fff8e1] dark:bg-[#f5c33b]/10 border border-[#f5c33b]/30 rounded-xl flex items-start gap-2 text-xs text-[#b78103] dark:text-[#f5c33b]">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Sau khi đổi vai trò, hệ thống sẽ tự động thu hồi phiên đăng nhập hiện tại để người dùng nhận quyền mới ngay khi đăng nhập.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy Bỏ
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isLoading}
            disabled={selectedRole === user.role}
          >
            Lưu Thay Đổi
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ChangeRoleModal

