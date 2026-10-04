import React, { useState } from 'react'
import {
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'

export interface CreateUserModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onSubmit: (data: {
    fullName: string
    username: string
    email: string
    password?: string
    role: 'ADMIN' | 'MODERATOR' | 'USER'
    gender: string
  }) => Promise<void>
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'MODERATOR' | 'USER'>('USER')
  const [gender, setGender] = useState('MALE')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let pass = ''
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pass)
    setShowPassword(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên.')
      return
    }
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.')
      return
    }
    if (!password.trim() || password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự.')
      return
    }

    try {
      await onSubmit({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        role,
        gender,
      })
      // Reset form
      setFullName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setRole('USER')
      setGender('MALE')
      onClose()
    } catch (err: any) {
      let msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Không thể tạo tài khoản, vui lòng kiểm tra lại.'

      if (typeof msg === 'string') {
        if (msg.includes('Email already exists') || msg.toLowerCase().includes('email đã tồn tại')) {
          msg = 'Địa chỉ Email này đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.'
        } else if (msg.includes('Username already exists') || msg.toLowerCase().includes('username đã tồn tại')) {
          msg = 'Tên đăng nhập (Username) này đã được sử dụng. Vui lòng chọn tên khác.'
        } else if (msg.includes('password') && msg.includes('size')) {
          msg = 'Mật khẩu khởi tạo không hợp lệ. Vui lòng nhập tối thiểu 6 ký tự.'
        } else if (msg.includes('FeignException') || msg.includes('during [POST]')) {
          const jsonMatch = msg.match(/\[(\{.*?\})\]/) || msg.match(/(\{.*?\})/)
          if (jsonMatch && jsonMatch[1]) {
            try {
              const parsed = JSON.parse(jsonMatch[1])
              if (parsed.message) {
                if (parsed.message.includes('Email already exists')) {
                  msg = 'Địa chỉ Email này đã tồn tại trong hệ thống.'
                } else if (parsed.message.includes('Username already exists')) {
                  msg = 'Tên đăng nhập (Username) này đã được sử dụng.'
                } else {
                  msg = parsed.message
                }
              }
            } catch {
              msg = 'Thông tin đăng ký không hợp lệ hoặc đã tồn tại trên hệ thống.'
            }
          } else {
            msg = 'Thông tin tài khoản không hợp lệ hoặc đã tồn tại.'
          }
        }
      }
      setError(msg)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Tài Khoản Người Dùng Mới"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-[#ffebe8] border border-[#fa383e]/30 text-[#fa383e] text-xs rounded-2xl font-semibold">
            {error}
          </div>
        )}

        {/* Role Selection Cards */}
        <div>
          <label className="block text-xs font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
            1. Chọn Vai Trò Tài Khoản (Role)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* ADMIN */}
            <div
              onClick={() => setRole('ADMIN')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                role === 'ADMIN'
                  ? 'border-[#0866ff] bg-[#e7f3ff] dark:bg-[#0866ff]/15 ring-2 ring-[#0866ff]/20 shadow-xs'
                  : 'border-[#e4e6eb] dark:border-[#393a3b] hover:border-[#bcc0c4] dark:hover:border-[#4e4f50] bg-white dark:bg-[#242526]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#e7f3ff] dark:bg-[#0866ff]/20 text-[#0866ff] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                {role === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#0866ff]" />}
              </div>
              <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">ADMIN</p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                Toàn quyền quản trị, bảo mật & hệ thống
              </p>
            </div>

            {/* MODERATOR */}
            <div
              onClick={() => setRole('MODERATOR')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                role === 'MODERATOR'
                  ? 'border-[#f5c33b] bg-[#fff8e1] dark:bg-[#f5c33b]/15 ring-2 ring-[#f5c33b]/20 shadow-xs'
                  : 'border-[#e4e6eb] dark:border-[#393a3b] hover:border-[#bcc0c4] dark:hover:border-[#4e4f50] bg-white dark:bg-[#242526]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#fff8e1] dark:bg-[#f5c33b]/20 text-[#b78103] dark:text-[#f5c33b] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                {role === 'MODERATOR' && <CheckCircle2 className="w-4 h-4 text-[#f5c33b]" />}
              </div>
              <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">MODERATOR</p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                Kiểm duyệt bài viết & xử lý báo cáo
              </p>
            </div>

            {/* USER */}
            <div
              onClick={() => setRole('USER')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                role === 'USER'
                  ? 'border-[#31a24c] bg-[#e7f8ed] dark:bg-[#31a24c]/15 ring-2 ring-[#31a24c]/20 shadow-xs'
                  : 'border-[#e4e6eb] dark:border-[#393a3b] hover:border-[#bcc0c4] dark:hover:border-[#4e4f50] bg-white dark:bg-[#242526]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#e7f8ed] dark:bg-[#31a24c]/20 text-[#31a24c] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                {role === 'USER' && <CheckCircle2 className="w-4 h-4 text-[#31a24c]" />}
              </div>
              <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">USER</p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                Thành viên mạng xã hội thông thường
              </p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div>
          <label className="block text-xs font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider mb-2">
            2. Thông Tin Tài Khoản
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1">
                Họ và Tên <span className="text-[#fa383e]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b] text-xs text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl outline-none focus:border-[#0866ff] focus:bg-white dark:focus:bg-[#3a3b3c] focus:ring-2 focus:ring-[#0866ff]/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1">
                Tên đăng nhập (Username) <span className="text-[#fa383e]">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: nguyenvana"
                className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b] text-xs text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl outline-none focus:border-[#0866ff] focus:bg-white dark:focus:bg-[#3a3b3c] focus:ring-2 focus:ring-[#0866ff]/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1">
                Địa chỉ Email <span className="text-[#fa383e]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="VD: nguyenvana@gmail.com"
                className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b] text-xs text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl outline-none focus:border-[#0866ff] focus:bg-white dark:focus:bg-[#3a3b3c] focus:ring-2 focus:ring-[#0866ff]/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] mb-1">
                Giới Tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b] text-xs font-semibold text-[#050505] dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl outline-none focus:border-[#0866ff] focus:bg-white dark:focus:bg-[#3a3b3c] transition cursor-pointer"
              >
                <option value="MALE">Nam (Male)</option>
                <option value="FEMALE">Nữ (Female)</option>
                <option value="OTHER">Khác (Other)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider">
              3. Mật Khẩu Khởi Tạo <span className="text-[#fa383e]">*</span>
            </label>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="text-[11px] font-bold text-[#0866ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tạo ngẫu nhiên</span>
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập tối thiểu 6 ký tự..."
              className="w-full bg-[#f0f2f5] dark:bg-[#3a3b3c]/60 border border-[#e4e6eb] dark:border-[#393a3b] text-xs font-mono text-[#050505] dark:text-[#e4e6eb] pl-3.5 pr-10 py-2.5 rounded-xl outline-none focus:border-[#0866ff] focus:bg-white dark:focus:bg-[#3a3b3c] focus:ring-2 focus:ring-[#0866ff]/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65676b] hover:text-[#050505] dark:hover:text-[#e4e6eb] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Hủy Bỏ
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Tạo Tài Khoản
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateUserModal

