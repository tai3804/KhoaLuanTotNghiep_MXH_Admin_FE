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
        <div className="p-3.5 bg-slate-50 dark:bg-[#1c1e21] rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Avatar
            src={user.avatarUrl}
            name={user.fullName || user.username}
            size="lg"
            shape="rounded"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
              {user.fullName}
            </h4>
            <p className="text-xs text-slate-400">@{user.username} • {user.email}</p>
            <p className="text-xs text-slate-500 mt-1">
              Vai trò hiện tại: <span className="font-bold text-[#1877f2]">{user.role}</span>
            </p>
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Chọn Vai Trò Mới
          </label>

          {/* ADMIN */}
          <div
            onClick={() => setSelectedRole('ADMIN')}
            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
              selectedRole === 'ADMIN'
                ? 'border-[#1877f2] bg-blue-50/70 dark:bg-[#1877f2]/15 ring-2 ring-[#1877f2]/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#242526]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#1877f2] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">ADMIN (Quản Trị Viên)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Toàn quyền quản trị, bảo mật & hệ thống
                </p>
              </div>
            </div>
            {selectedRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#1877f2]" />}
          </div>

          {/* MODERATOR */}
          <div
            onClick={() => setSelectedRole('MODERATOR')}
            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
              selectedRole === 'MODERATOR'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-500/15 ring-2 ring-amber-500/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#242526]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">MODERATOR (Kiểm Duyệt Viên)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Kiểm duyệt bài viết, bình luận & xử lý báo cáo vi phạm
                </p>
              </div>
            </div>
            {selectedRole === 'MODERATOR' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
          </div>

          {/* USER */}
          <div
            onClick={() => setSelectedRole('USER')}
            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
              selectedRole === 'USER'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#242526]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">USER (Thành Viên Thường)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Người dùng mạng xã hội thông thường
                </p>
              </div>
            </div>
            {selectedRole === 'USER' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        {/* Note */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Sau khi đổi vai trò, hệ thống sẽ tự động thu hồi phiên đăng nhập hiện tại để người dùng nhận quyền mới ngay khi đăng nhập.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
