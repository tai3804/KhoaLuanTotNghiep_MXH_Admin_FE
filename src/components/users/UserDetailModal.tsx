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
          <div className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
            {isSelf && <span className="text-[#0866ff] font-semibold">• Tài khoản hiện tại của bạn</span>}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Cover Banner & Profile Header */}
        <div className="rounded-2xl overflow-hidden border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5] dark:bg-[#18191a]">
          {/* Cover Photo / Gradient Banner */}
          <div
            className="h-28 w-full bg-gradient-to-r from-[#0866ff] to-[#0055d6] relative bg-cover bg-center"
            style={user.coverUrl ? { backgroundImage: `url(${user.coverUrl})` } : undefined}
          >
            <div className="absolute inset-0 bg-black/15" />
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
                  <h3 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] font-bold">
                      Bạn
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
                  <span>@{user.username}</span>
                  <span>•</span>
                  <button
                    onClick={() => handleCopy(user.id, 'id')}
                    className="flex items-center gap-1 hover:text-[#0866ff] transition-colors cursor-pointer text-[11px] font-mono font-semibold"
                    title="Sao chép User ID"
                  >
                    <span>ID: {user.id.slice(0, 8)}...</span>
                    {copiedField === 'id' ? (
                      <CheckCheck className="w-3 h-3 text-[#31a24c]" />
                    ) : (
                      <Copy className="w-3 h-3 text-[#65676b] dark:text-[#b0b3b8]" />
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
        <div className="flex items-center gap-2 border-b border-[#e4e6eb] dark:border-[#393a3b] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] shadow-xs'
                : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Hồ Sơ & Cá Nhân</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] shadow-xs'
                : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tương Tác & Thống Kê</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] shadow-xs'
                : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
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
            <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b]">
              <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider block mb-1">
                Tiểu sử / Giới thiệu
              </span>
              <p className="text-xs text-[#050505] dark:text-[#e4e6eb] italic leading-relaxed">
                {user.bio ? `"${user.bio}"` : 'Thành viên này chưa cập nhật phần giới thiệu cá nhân.'}
              </p>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Email */}
              <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block font-semibold">Địa chỉ Email</span>
                    <span className="font-semibold text-[#050505] dark:text-[#e4e6eb] break-all">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(user.email, 'email')}
                  className="p-1 hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b3c] rounded-lg transition-colors text-[#65676b] dark:text-[#b0b3b8] cursor-pointer"
                  title="Sao chép email"
                >
                  {copiedField === 'email' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-[#31a24c]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e7f8ed] text-[#31a24c] dark:bg-[#31a24c]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block font-semibold">Số điện thoại</span>
                  <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                    {user.phoneNumber || 'Chưa liên kết số điện thoại'}
                  </span>
                </div>
              </div>

              {/* Gender */}
              <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block font-semibold">Giới tính</span>
                  <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">{formatGender(user.gender)}</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fff8e1] text-[#b78103] dark:text-[#f5c33b] dark:bg-[#f5c33b]/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block font-semibold">Ngày sinh</span>
                  <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ffebe8] text-[#fa383e] dark:bg-[#fa383e]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block font-semibold">Khu vực / Nơi ở</span>
                  <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                    {user.location || 'Việt Nam'}
                  </span>
                </div>
              </div>

              {/* Website */}
              <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e5f6fd] text-[#0288d1] dark:bg-[#0288d1]/20 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] block font-semibold">Website / Liên kết</span>
                  <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                    {user.website ? (
                      <a href={user.website} target="_blank" rel="noreferrer" className="text-[#0866ff] hover:underline">
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
              <div className="p-3.5 rounded-2xl bg-[#e7f3ff] dark:bg-[#0866ff]/15 border border-[#0866ff]/20 text-center">
                <FileText className="w-5 h-5 text-[#0866ff] mx-auto mb-1" />
                <span className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb] block">
                  {user.postsCount ?? 0}
                </span>
                <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] font-semibold">Bài viết đã đăng</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#e7f3ff] dark:bg-[#0866ff]/15 border border-[#0866ff]/20 text-center">
                <Users className="w-5 h-5 text-[#0866ff] mx-auto mb-1" />
                <span className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb] block">
                  {user.friendsCount ?? user.friendCount ?? 0}
                </span>
                <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] font-semibold">Bạn bè kết nối</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fff8e1] dark:bg-[#f5c33b]/15 border border-[#f5c33b]/20 text-center">
                <Heart className="w-5 h-5 text-[#f5c33b] mx-auto mb-1" />
                <span className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb] block">
                  {user.followerCount ?? 0}
                </span>
                <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] font-semibold">Người theo dõi</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#e7f8ed] dark:bg-[#31a24c]/15 border border-[#31a24c]/20 text-center">
                <Share2 className="w-5 h-5 text-[#31a24c] mx-auto mb-1" />
                <span className="text-lg font-bold text-[#050505] dark:text-[#e4e6eb] block">
                  {user.followingCount ?? 0}
                </span>
                <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] font-semibold">Đang theo dõi</span>
              </div>
            </div>

            {/* Timelines & Online Status */}
            <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#e4e6eb] dark:border-[#393a3b]">
                <div className="flex items-center gap-2 text-[#65676b] dark:text-[#b0b3b8]">
                  <Calendar className="w-4 h-4 text-[#65676b]" />
                  <span>Ngày tạo tài khoản:</span>
                </div>
                <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Mới'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#e4e6eb] dark:border-[#393a3b]">
                <div className="flex items-center gap-2 text-[#65676b] dark:text-[#b0b3b8]">
                  <Clock className="w-4 h-4 text-[#65676b]" />
                  <span>Lần cập nhật gần nhất:</span>
                </div>
                <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'Mới đây'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-[#65676b] dark:text-[#b0b3b8]">
                  <Radio className="w-4 h-4 text-[#65676b]" />
                  <span>Trạng thái kết nối:</span>
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-[#050505] dark:text-[#e4e6eb]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.isOnline ? 'bg-[#31a24c] animate-pulse' : 'bg-[#bcc0c4]'
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
            <div className="p-3.5 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] font-bold uppercase tracking-wider block mb-0.5">
                  Mã định danh hệ thống (UUID)
                </span>
                <span className="font-mono text-[#050505] dark:text-[#e4e6eb] font-semibold">{user.id}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(user.id, 'uuid')}
                className="shrink-0"
              >
                {copiedField === 'uuid' ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 mr-1 text-[#31a24c]" />
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

            {/* Quick Security Actions */}
            {!isSelf && (
              <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] space-y-2.5">
                <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider block">
                  Thao tác Quản trị & Bảo mật
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {onResetPassword && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onResetPassword(user)}
                      className="justify-center border-[#0866ff]/30 text-[#0866ff] dark:text-[#2d88ff] hover:bg-[#e7f3ff] dark:hover:bg-[#0866ff]/20"
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
                      className="justify-center border-[#f5c33b]/30 text-[#b78103] dark:text-[#f5c33b] hover:bg-[#fff8e1] dark:hover:bg-[#f5c33b]/20"
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
                      className="justify-center border-[#fa383e]/30 text-[#fa383e] hover:bg-[#ffebe8] dark:hover:bg-[#fa383e]/20"
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
              <div className="p-4 rounded-2xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b]">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
                  <Shield className="w-4 h-4 text-[#0866ff]" />
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
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        user.role === r.id
                          ? 'border-[#0866ff] bg-[#e7f3ff] dark:bg-[#0866ff]/15 text-[#0866ff] dark:text-[#2d88ff] font-bold shadow-xs'
                          : 'border-[#e4e6eb] dark:border-[#393a3b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">{r.label}</span>
                        {user.role === r.id && <Check className="w-3.5 h-3.5 text-[#0866ff]" />}
                      </div>
                      <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] font-normal block mt-1">
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isSelf && (
              <div className="p-3.5 rounded-2xl bg-[#e7f3ff] border border-[#0866ff]/30 text-[#0866ff] dark:text-[#2d88ff] text-xs flex items-center gap-2 font-medium">
                <Info className="w-4 h-4 shrink-0" />
                <span>Đây là tài khoản hiện tại của bạn. Hệ thống tự động vô hiệu hóa việc tự thay đổi vai trò hoặc tự khóa chính mình.</span>
              </div>
            )}

            {/* Ban Reason if any */}
            {user.isBanned && (
              <div className="p-4 rounded-2xl bg-[#ffebe8] border border-[#fa383e]/30 text-[#fa383e] text-xs">
                <div className="flex items-center gap-2 font-bold mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Chi tiết vi phạm & Trạng thái khóa:</span>
                </div>
                <p className="leading-relaxed">
                  {user.banReason || 'Vi phạm điều khoản cộng đồng mạng xã hội.'}
                </p>
                {user.bannedAt && (
                  <p className="text-[11px] text-[#fa383e]/80 mt-1 font-semibold">
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


