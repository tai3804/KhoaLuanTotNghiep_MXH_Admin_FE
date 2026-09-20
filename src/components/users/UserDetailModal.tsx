import React from 'react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import { Calendar, Mail, Phone, FileText, Users, AlertTriangle } from 'lucide-react'

export interface UserDetailModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hồ Sơ Thành Viên"
      maxWidth="md"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Đóng
        </Button>
      }
    >
      <div className="space-y-6">
        {/* User Banner & Avatar */}
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatarUrl}
            name={user.fullName || user.username}
            size="xl"
            shape="rounded"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {user.fullName}
              </h4>
              <Badge
                variant={
                  user.role === 'ADMIN'
                    ? 'primary'
                    : user.role === 'MODERATOR'
                    ? 'warning'
                    : 'neutral'
                }
                size="sm"
              >
                {user.role}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">@{user.username}</p>
            <div className="mt-2">
              <Badge
                variant={user.isBanned ? 'danger' : 'success'}
                size="sm"
                dot
              >
                {user.isBanned ? 'Tài khoản đang bị khóa' : 'Đang hoạt động'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#3a3b3c]/40 text-xs border border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2 text-slate-600 dark:text-[#b0b3b8]">
            <Mail className="w-4 h-4 text-slate-400 dark:text-[#b0b3b8]" />
            <span className="truncate text-slate-800 dark:text-[#e4e6eb]">{user.email}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-[#b0b3b8]">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-[#b0b3b8]" />
            <span className="text-slate-800 dark:text-[#e4e6eb]">Tham gia: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Mới'}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-[#b0b3b8]">
            <FileText className="w-4 h-4 text-slate-400 dark:text-[#b0b3b8]" />
            <span className="text-slate-800 dark:text-[#e4e6eb]">{user.postsCount ?? 0} bài viết đã đăng</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-[#b0b3b8]">
            <Users className="w-4 h-4 text-slate-400 dark:text-[#b0b3b8]" />
            <span className="text-slate-800 dark:text-[#e4e6eb]">{user.friendsCount ?? 0} bạn bè kết nối</span>
          </div>
        </div>

        {/* Ban Reason if any */}
        {user.isBanned && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Lý do khóa tài khoản:</span>
            </div>
            <p>{user.banReason || 'Vi phạm điều khoản cộng đồng mạng xã hội.'}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default UserDetailModal
