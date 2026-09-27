import React, { useState } from 'react'
import { KeyRound, RefreshCw, Copy, CheckCheck, AlertCircle, ShieldAlert } from 'lucide-react'
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

        {/* Warning Callout */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Hệ thống sẽ cập nhật mật khẩu mới và tự động hủy bỏ mọi phiên đăng nhập đang hoạt động của người dùng này trên tất cả các thiết bị.
          </span>
        </div>

        {/* Password input & generator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mật khẩu mới
            </label>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="text-[11px] text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium cursor-pointer"
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
              className={`w-full bg-slate-50 dark:bg-[#1c1e21] text-xs font-mono font-bold text-slate-900 dark:text-white px-3 py-2.5 pr-20 rounded-xl border outline-none transition-colors ${
                error
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
              }`}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
          {error && <p className="text-rose-500 text-[11px] mt-1">{error}</p>}
        </div>

        {/* Tip */}
        <p className="text-[11px] text-slate-400 italic">
          💡 Vui lòng sao chép mật khẩu mới để bàn giao lại cho người dùng sau khi hoàn tất.
        </p>
      </div>
    </Modal>
  )
}

export default ResetPasswordModal
