import React, { useState } from 'react'
import { Send, Bell, AlertTriangle, Info, Megaphone, CheckCircle2 } from 'lucide-react'
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
          <div className="p-3 bg-slate-50 dark:bg-[#1c1e21] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Avatar
              src={user.avatarUrl}
              name={user.fullName || user.username}
              size="md"
              shape="rounded"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                {user.fullName}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">@{user.username} • {user.email}</p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Thông báo này sẽ được gửi tới toàn bộ người dùng đang hoạt động trong hệ thống.</span>
          </div>
        )}

        {/* Notification Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Loại thông báo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'WARNING', label: 'Cảnh Cáo', icon: AlertTriangle, color: 'text-amber-500' },
              { id: 'SYSTEM', label: 'Hệ Thống', icon: Info, color: 'text-blue-500' },
              { id: 'ANNOUNCEMENT', label: 'Thông Báo', icon: Bell, color: 'text-emerald-500' },
            ].map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    type === t.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
            className="w-full bg-slate-50 dark:bg-[#1c1e21] text-xs text-slate-900 dark:text-white px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
            className="w-full bg-slate-50 dark:bg-[#1c1e21] text-xs text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {error && <p className="text-rose-500 text-[11px]">{error}</p>}
      </div>
    </Modal>
  )
}

export default SendNotificationModal
