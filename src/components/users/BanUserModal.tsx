import React, { useState } from 'react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { ShieldBan, AlertTriangle } from 'lucide-react'

export interface BanUserModalProps {
  user: User | null
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onConfirm: (userId: string, reason: string) => void
}

export const BanUserModal: React.FC<BanUserModalProps> = ({
  user,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('')
  const [preset, setPreset] = useState('SPAM')

  if (!user) return null

  const handleConfirm = () => {
    const finalReason = reason.trim() || `Vi phạm chính sách cộng đồng: ${preset}`
    onConfirm(user.id, finalReason)
    setReason('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Khóa Tài Khoản Người Dùng"
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Hủy Bỏ
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            <ShieldBan className="w-4 h-4 mr-1" />
            Xác Nhận Khóa
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>
            Bạn đang thực hiện khóa tài khoản <strong>@{user.username}</strong> ({user.fullName}). Người dùng này sẽ không thể đăng nhập hoặc tương tác trên mạng xã hội.
          </p>
        </div>

        {/* Preset Reasons */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#e4e6eb] mb-1.5">
            Lý do phổ biến
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#3a3b3c]/50 text-xs text-slate-900 dark:text-[#e4e6eb] p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#1877f2]"
          >
            <option value="SPAM">Phát tán tin rác / Quảng cáo trái phép</option>
            <option value="SCAM">Hành vi lừa đảo / Gian lận tài chính</option>
            <option value="HATE_SPEECH">Ngôn từ kích động thù địch / Xúc phạm</option>
            <option value="NSFW">Chia sẻ hình ảnh nhạy cảm / Đồi trụy 18+</option>
            <option value="OTHER">Lý do khác (Nhập chi tiết bên dưới)</option>
          </select>
        </div>

        {/* Custom Reason Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#e4e6eb] mb-1.5">
            Ghi chú chi tiết (Tùy chọn)
          </label>
          <textarea
            rows={3}
            placeholder="Nhập chi tiết lý do khóa để lưu lại lịch sử Audit Log..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#3a3b3c]/50 text-xs text-slate-900 dark:text-[#e4e6eb] p-3 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#1877f2] resize-none"
          />
        </div>
      </div>
    </Modal>
  )
}

export default BanUserModal
