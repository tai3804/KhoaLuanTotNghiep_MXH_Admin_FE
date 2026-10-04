import React, { useState } from 'react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import { ShieldBan, AlertTriangle, Clock, Lock, MessageSquareX, EyeOff, ShieldAlert } from 'lucide-react'

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
  const [duration, setDuration] = useState('PERMANENT')

  if (!user) return null

  const handleConfirm = () => {
    const durationText =
      duration === '1_DAY'
        ? ' (Thời hạn: 1 ngày)'
        : duration === '7_DAYS'
        ? ' (Thời hạn: 7 ngày)'
        : duration === '30_DAYS'
        ? ' (Thời hạn: 30 ngày)'
        : ' (Khóa vĩnh viễn)'

    const finalReason =
      (reason.trim() || `Vi phạm chính sách cộng đồng: ${preset}`) + durationText
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
            Xác Nhận Khóa Tài Khoản
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* User Card Summary */}
        <div className="p-3.5 bg-[#f0f2f5] dark:bg-[#18191a] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-3">
          <Avatar
            src={user.avatarUrl}
            name={user.fullName || user.username}
            size="lg"
            shape="rounded"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#050505] dark:text-[#e4e6eb] text-sm truncate">
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
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">@{user.username} • {user.email}</p>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#fff8e1] dark:bg-[#f5c33b]/10 border border-[#f5c33b]/30 text-[#b78103] dark:text-[#f5c33b] text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Hành động khóa sẽ ngay lập tức vô hiệu hóa phiên đăng nhập của người dùng. Tài khoản sẽ không thể đăng bài, bình luận hoặc nhắn tin.
          </p>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#0866ff]" />
            <span>Thời hạn áp dụng khóa</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '1_DAY', label: '1 Ngày', desc: 'Cảnh cáo nhẹ' },
              { id: '7_DAYS', label: '7 Ngày', desc: '1 Tuần' },
              { id: '30_DAYS', label: '30 Ngày', desc: '1 Tháng' },
              { id: 'PERMANENT', label: 'Vĩnh Viễn', desc: 'Khóa hoàn toàn' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDuration(d.id)}
                className={`p-2.5 rounded-2xl text-center border text-xs transition-all cursor-pointer ${
                  duration === d.id
                    ? 'border-[#fa383e] bg-[#ffebe8] dark:bg-[#fa383e]/20 text-[#fa383e] font-bold shadow-xs'
                    : 'border-[#e4e6eb] dark:border-[#393a3b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
                }`}
              >
                <div className="font-semibold">{d.label}</div>
                <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block mt-0.5">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preset Reasons */}
        <div>
          <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#fa383e]" />
            <span>Lý do vi phạm chính</span>
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#0866ff] cursor-pointer"
          >
            <option value="SPAM">Phát tán tin rác / Quảng cáo trái phép (Spam)</option>
            <option value="SCAM">Hành vi lừa đảo / Gian lận tài chính</option>
            <option value="HATE_SPEECH">Ngôn từ kích động thù địch / Xúc phạm người khác</option>
            <option value="NSFW">Chia sẻ nội dung nhạy cảm / Đồi trụy 18+</option>
            <option value="HARASSMENT">Quấy rối / Đe dọa thành viên khác</option>
            <option value="OTHER">Lý do vi phạm khác (Nhập chi tiết)</option>
          </select>
        </div>

        {/* Custom Reason Note */}
        <div>
          <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            Ghi chú chi tiết (Lưu vào Audit Log)
          </label>
          <textarea
            rows={2}
            placeholder="Nhập chi tiết căn cứ và bằng chứng vi phạm để đối soát sau này..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs text-[#050505] dark:text-[#e4e6eb] p-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 resize-none"
          />
        </div>

        {/* Restriction Impacts */}
        <div className="p-3 bg-[#f0f2f5] dark:bg-[#18191a] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] space-y-1.5 text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#fa383e]" />
            <span>Thu hồi Access Token & Refresh Token ngay lập tức</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquareX className="w-3 h-3 text-[#fa383e]" />
            <span>Vô hiệu hóa quyền tạo bài viết, gửi tin nhắn & bình luận</span>
          </div>
          <div className="flex items-center gap-1.5">
            <EyeOff className="w-3 h-3 text-[#fa383e]" />
            <span>Tạm ẩn trang cá nhân khỏi công cụ tìm kiếm cộng đồng</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BanUserModal

