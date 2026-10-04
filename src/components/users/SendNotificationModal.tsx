import React, { useState } from 'react'
import { Send, Bell, AlertTriangle, Info, Megaphone } from 'lucide-react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

export interface SendNotificationModalProps {
  user: User | null // null means broadcast to all
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onSend: (payload: { recipientId?: string; title: string; content: string; type: string }) => Promise<void>
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  user,
  isOpen,
  isLoading = false,
  onClose,
  onSend,
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'SYSTEM' | 'WARNING' | 'ANNOUNCEMENT'>('WARNING')
  const [error, setError] = useState('')

  React.useEffect(() => {
    if (isOpen) {
      setTitle(user ? 'Cảnh cáo vi phạm tiêu chuẩn cộng đồng' : 'Thông báo hệ thống từ Quản trị viên')
      setContent('')
      setType(user ? 'WARNING' : 'ANNOUNCEMENT')
      setError('')
    }
  }, [isOpen, user])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.')
      return
    }
    await onSend({
      recipientId: user ? user.id : undefined,
      title: title.trim(),
      content: content.trim(),
      type,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? `Gửi Thông Báo / Cảnh Cáo Đến @${user.username}` : 'Gửi Thông Báo Toàn Hệ Thống'}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Hủy Bỏ
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Gửi Ngay
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Recipient Target */}
        {user ? (
          <div className="p-3.5 bg-[#f0f2f5] dark:bg-[#18191a] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-3">
            <Avatar
              src={user.avatarUrl}
              name={user.fullName || user.username}
              size="md"
              shape="rounded"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[#050505] dark:text-[#e4e6eb] text-xs truncate">
                {user.fullName}
              </h4>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] truncate">@{user.username} • {user.email}</p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#e7f3ff] dark:bg-[#0866ff]/15 border border-[#0866ff]/30 rounded-2xl flex items-center gap-2 text-xs text-[#0866ff] dark:text-[#2d88ff] font-semibold">
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Thông báo này sẽ được gửi tới toàn bộ người dùng đang hoạt động trong hệ thống.</span>
          </div>
        )}

        {/* Notification Type */}
        <div>
          <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            Loại thông báo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'WARNING', label: 'Cảnh Cáo', icon: AlertTriangle, color: 'text-[#fa383e]' },
              { id: 'SYSTEM', label: 'Hệ Thống', icon: Info, color: 'text-[#0866ff]' },
              { id: 'ANNOUNCEMENT', label: 'Thông Báo', icon: Bell, color: 'text-[#31a24c]' },
            ].map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === t.id
                      ? 'border-[#0866ff] bg-[#e7f3ff] dark:bg-[#0866ff]/15 text-[#0866ff] dark:text-[#2d88ff] font-bold shadow-xs'
                      : 'border-[#e4e6eb] dark:border-[#393a3b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1">
            Tiêu đề thông báo
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
            placeholder="Nhập tiêu đề..."
            className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1">
            Nội dung chi tiết
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              setError('')
            }}
            placeholder="Nhập nội dung thông báo gửi đến chuông thông báo của người dùng..."
            className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs text-[#050505] dark:text-[#e4e6eb] p-3 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 outline-none resize-none"
          />
        </div>

        {error && <p className="text-[#fa383e] text-[11px] font-semibold">{error}</p>}
      </div>
    </Modal>
  )
}

export default SendNotificationModal

