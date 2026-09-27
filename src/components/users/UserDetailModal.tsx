import React, { useState } from 'react'
import { User } from '../../types/user'
import Modal from '../common/Modal'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import {
  Calendar,
  Mail,
  Phone,
  FileText,
  Users,
  AlertTriangle,
  Shield,
  Check,
  User as UserIcon,
  Copy,
  CheckCheck,
  Activity,
  MapPin,
  Globe,
  Radio,
  Clock,
  Heart,
  Share2,
  ShieldAlert,
  Info,
  KeyRound,
  Bell,
  LogOut
} from 'lucide-react'
import { useAppSelector } from '../../store'

export interface UserDetailModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onRoleChange?: (userId: string, newRole: string) => Promise<void>
  onResetPassword?: (user: User) => void
  onRevokeSessions?: (user: User) => void
  onSendNotification?: (user: User) => void
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onRoleChange,
  onResetPassword,
  onRevokeSessions,
  onSendNotification,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user)
  const [isChangingRole, setIsChangingRole] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'security'>('profile')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!user) return null

  const isSelf = Boolean(
    currentUser &&
      ((currentUser.id && String(currentUser.id) === String(user.id)) ||
        (currentUser.email && currentUser.email.toLowerCase() === user.email.toLowerCase()) ||
        (currentUser.username && currentUser.username.toLowerCase() === user.username.toLowerCase()))
  )

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleRoleSelect = async (newRole: string) => {
    if (isSelf || !onRoleChange || user.role === newRole) return
    setIsChangingRole(true)
    try {
      await onRoleChange(user.id, newRole)
    } finally {
      setIsChangingRole(false)
    }
  }

  const formatGender = (gender?: string) => {
    if (!gender) return 'Chưa thiết lập'
    if (gender.toUpperCase() === 'MALE') return 'Nam'
    if (gender.toUpperCase() === 'FEMALE') return 'Nữ'
    return 'Khác'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hồ Sơ Chi Tiết Thành Viên"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-400">
            {isSelf && <span className="text-blue-500 font-medium">• Tài khoản hiện tại của bạn</span>}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Cover Banner & Profile Header */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#1c1e21]">
          {/* Cover Photo / Gradient Banner */}
          <div
            className="h-28 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative bg-cover bg-center"
            style={user.coverUrl ? { backgroundImage: `url(${user.coverUrl})` } : undefined}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* User Info Line */}
          <div className="px-5 pb-4 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-3.5 -mt-10">
              <div className="ring-4 ring-white dark:ring-[#242526] rounded-2xl overflow-hidden bg-white dark:bg-[#242526] shadow-md shrink-0">
                <Avatar
                  src={user.avatarUrl}
                  name={user.fullName || user.username}
                  size="xl"
                  shape="rounded"
                />
              </div>
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {user.fullName || 'Người dùng'}
                  </h3>
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
                  {isSelf && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">
                      Bạn
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>@{user.username}</span>
                  <span>•</span>
                  <button
                    onClick={() => handleCopy(user.id, 'id')}
                    className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer text-[11px] font-mono"
                    title="Sao chép User ID"
                  >
                    <span>ID: {user.id.slice(0, 8)}...</span>
                    {copiedField === 'id' ? (
                      <CheckCheck className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Indicator Badge */}
            <div className="pb-1 shrink-0">
              <Badge
                variant={user.isBanned ? 'danger' : 'success'}
                size="sm"
                dot
              >
                {user.isBanned ? 'Tài khoản đã bị khóa' : 'Đang hoạt động'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Hồ Sơ & Cá Nhân</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tương Tác & Thống Kê</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Bảo Mật & Phân Quyền</span>
          </button>
        </div>

        {/* Tab 1: Profile & Personal Details */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Bio Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tiểu sử / Giới thiệu
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                {user.bio ? `"${user.bio}"` : 'Thành viên này chưa cập nhật phần giới thiệu cá nhân.'}
              </p>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Email */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Địa chỉ Email</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 break-all">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(user.email, 'email')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400"
                  title="Sao chép email"
                >
                  {copiedField === 'email' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Số điện thoại</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.phoneNumber || 'Chưa liên kết số điện thoại'}
                  </span>
                </div>
              </div>

              {/* Gender */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Giới tính</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatGender(user.gender)}</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Ngày sinh</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Khu vực / Nơi ở</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.location || 'Việt Nam'}
                  </span>
                </div>
              </div>

              {/* Website */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Website / Liên kết</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.website ? (
                      <a href={user.website} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
                        {user.website}
                      </a>
                    ) : (
                      'Chưa thiết lập'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Activity & Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* 4 Large Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <FileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 dark:text-white block">
                  {user.postsCount ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Bài viết đã đăng</span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <Users className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 dark:text-white block">
                  {user.friendsCount ?? user.friendCount ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Bạn bè kết nối</span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <Heart className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 dark:text-white block">
                  {user.followerCount ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Người theo dõi</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <Share2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 dark:text-white block">
                  {user.followingCount ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Đang theo dõi</span>
              </div>
            </div>

            {/* Timelines & Online Status */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Ngày tạo tài khoản:</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Mới'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Lần cập nhật gần nhất:</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'Mới đây'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <Radio className="w-4 h-4 text-slate-400" />
                  <span>Trạng thái kết nối:</span>
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  {user.isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Role Assignment */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* System UUID */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                  Mã định danh hệ thống (UUID)
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{user.id}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(user.id, 'uuid')}
                className="shrink-0"
              >
                {copiedField === 'uuid' ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Sao chép</span>
                  </>
                )}
              </Button>
            </div>

            {/* Quick Security Actions (Reset Pass, Force Logout, Send Notice) */}
            {!isSelf && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Thao tác Quản trị & Bảo mật
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {onResetPassword && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResetPassword(user)}
                      className="justify-center border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                    >
                      Đặt lại mật khẩu
                    </Button>
                  )}

                  {onSendNotification && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSendNotification(user)}
                      className="justify-center border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      leftIcon={<Bell className="w-3.5 h-3.5" />}
                    >
                      Gửi cảnh báo / tin
                    </Button>
                  )}

                  {onRevokeSessions && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRevokeSessions(user)}
                      className="justify-center border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      leftIcon={<LogOut className="w-3.5 h-3.5" />}
                    >
                      Cưỡng chế đăng xuất
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Role Assignment Section */}
            {onRoleChange && !isSelf && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span>Gán vai trò & Phân quyền thành viên</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'USER', label: 'Thành Viên', desc: 'Quyền cơ bản mạng xã hội' },
                    { id: 'MODERATOR', label: 'Kiểm Duyệt', desc: 'Duyệt report & bài viết' },
                    { id: 'ADMIN', label: 'Quản Trị', desc: 'Toàn quyền quản trị hệ thống' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      disabled={isChangingRole}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        user.role === r.id
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span>{r.label}</span>
                        {user.role === r.id && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal block mt-1">
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isSelf && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Đây là tài khoản hiện tại của bạn. Hệ thống tự động vô hiệu hóa việc tự thay đổi vai trò hoặc tự khóa chính mình.</span>
              </div>
            )}

            {/* Ban Reason if any */}
            {user.isBanned && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Chi tiết vi phạm & Trạng thái khóa:</span>
                </div>
                <p className="leading-relaxed">
                  {user.banReason || 'Vi phạm điều khoản cộng đồng mạng xã hội.'}
                </p>
                {user.bannedAt && (
                  <p className="text-[11px] text-rose-500/80 mt-1">
                    Thời gian khóa: {new Date(user.bannedAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default UserDetailModal

