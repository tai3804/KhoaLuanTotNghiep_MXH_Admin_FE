import React, { useState } from 'react'
import { KeyRound, RefreshCw, Copy, CheckCheck, AlertCircle } from 'lucide-react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

export interface ResetPasswordModalProps {
  user: User | null
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onConfirm: (userId: string, newPassword: string) => Promise<void>
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*'
    let pass = ''
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pass)
    setError('')
  }

  React.useEffect(() => {
    if (isOpen) {
      generateRandomPassword()
      setCopied(false)
      setError('')
    }
  }, [isOpen])

  if (!user) return null

  const handleCopy = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    await onConfirm(user.id, password)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đặt Lại Mật Khẩu Thành Viên"
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
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Lưu Mật Khẩu Mới
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* User Card */}
        <div className="p-3 bg-[#f0f2f5] dark:bg-[#18191a] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-3">
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

        {/* Warning Callout */}
        <div className="p-3 bg-[#fff8e1] dark:bg-[#f5c33b]/10 border border-[#f5c33b]/30 rounded-2xl flex items-start gap-2 text-xs text-[#b78103] dark:text-[#f5c33b]">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Hệ thống sẽ cập nhật mật khẩu mới và tự động hủy bỏ mọi phiên đăng nhập đang hoạt động của người dùng này trên tất cả các thiết bị.
          </span>
        </div>

        {/* Password input & generator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb]">
              Mật khẩu mới
            </label>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="text-[11px] text-[#0866ff] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Tạo ngẫu nhiên mật khẩu mạnh</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Nhập mật khẩu mới..."
              className={`w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-xs font-mono font-bold text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 pr-20 rounded-xl border outline-none transition-colors ${
                error
                  ? 'border-[#fa383e] focus:ring-2 focus:ring-[#fa383e]/20'
                  : 'border-[#e4e6eb] dark:border-[#393a3b] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20'
              }`}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#4e4f50] dark:hover:bg-[#5a5b5c] rounded-lg text-[11px] font-semibold text-[#050505] dark:text-[#e4e6eb] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3 h-3 text-[#31a24c]" />
                  <span className="text-[#31a24c]">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
          {error && <p className="text-[#fa383e] text-[11px] mt-1 font-medium">{error}</p>}
        </div>

        {/* Tip */}
        <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] italic">
          💡 Vui lòng sao chép mật khẩu mới để bàn giao lại cho người dùng sau khi hoàn tất.
        </p>
      </div>
    </Modal>
  )
}

export default ResetPasswordModal

