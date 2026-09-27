import React, { useState, useEffect } from 'react'
import {
  Megaphone,
  Clock,
  Send,
  Trash2,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Eye,
} from 'lucide-react'
import Button from '../common/Button'

interface SystemAnnouncementCardProps {
  configs: Record<string, string>
  onSaveConfig: (updated: Record<string, string>) => Promise<void>
}

export const SystemAnnouncementCard: React.FC<SystemAnnouncementCardProps> = ({
  configs,
  onSaveConfig,
}) => {
  const [announcementText, setAnnouncementText] = useState(configs.system_announcement || '')
  const [bannerType, setBannerType] = useState<'INFO' | 'WARNING' | 'CRITICAL'>(
    (configs.announcement_type as any) || 'WARNING'
  )
  const [isScheduled, setIsScheduled] = useState(configs.announcement_is_scheduled === 'true')
  const [scheduledTime, setScheduledTime] = useState(
    configs.announcement_scheduled_at || ''
  )
  const [durationHours, setDurationHours] = useState(
    configs.announcement_duration_hours || '24'
  )
  const [isActive, setIsActive] = useState(
    Boolean(configs.system_announcement && configs.announcement_is_active !== 'false')
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localFeedback, setLocalFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    setAnnouncementText(configs.system_announcement || '')
    setBannerType((configs.announcement_type as any) || 'WARNING')
    setIsScheduled(configs.announcement_is_scheduled === 'true')
    setScheduledTime(configs.announcement_scheduled_at || '')
    setDurationHours(configs.announcement_duration_hours || '24')
    setIsActive(Boolean(configs.system_announcement && configs.announcement_is_active !== 'false'))
  }, [configs])

  // Check if current schedule time is in the future
  const isScheduledInFuture =
    isScheduled && scheduledTime && new Date(scheduledTime).getTime() > Date.now()

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) {
      setLocalFeedback({ type: 'error', text: 'Vui lòng nhập nội dung thông báo khẩn.' })
      setTimeout(() => setLocalFeedback(null), 3000)
      return
    }

    if (isScheduled && !scheduledTime) {
      setLocalFeedback({ type: 'error', text: 'Vui lòng chọn ngày và giờ phát thông báo.' })
      setTimeout(() => setLocalFeedback(null), 3000)
      return
    }

    setIsSubmitting(true)
    setLocalFeedback(null)

    try {
      const expiresAt =
        durationHours !== '0'
          ? new Date(
              (isScheduled && scheduledTime ? new Date(scheduledTime).getTime() : Date.now()) +
                Number(durationHours) * 3600 * 1000
            ).toISOString()
          : ''

      const payload: Record<string, string> = {
        ...configs,
        system_announcement: announcementText.trim(),
        announcement_type: bannerType,
        announcement_is_active: 'true',
        announcement_is_scheduled: isScheduled ? 'true' : 'false',
        announcement_scheduled_at: isScheduled ? scheduledTime : '',
        announcement_duration_hours: durationHours,
        announcement_expires_at: expiresAt,
        announcement_updated_at: new Date().toISOString(),
      }

      await onSaveConfig(payload)
      setIsActive(true)
      setLocalFeedback({
        type: 'success',
        text: isScheduled
          ? `Đã lên lịch phát thông báo vào ${new Date(scheduledTime).toLocaleString('vi-VN')}!`
          : 'Đã phát sóng thông báo khẩn toàn hệ thống thành công!',
      })
      setTimeout(() => setLocalFeedback(null), 4000)
    } catch (err) {
      setLocalFeedback({ type: 'error', text: 'Lỗi khi gửi thông báo. Vui lòng thử lại.' })
      setTimeout(() => setLocalFeedback(null), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeactivateAnnouncement = async () => {
    setIsSubmitting(true)
    try {
      const payload: Record<string, string> = {
        ...configs,
        system_announcement: '',
        announcement_is_active: 'false',
        announcement_is_scheduled: 'false',
        announcement_scheduled_at: '',
        announcement_expires_at: '',
      }
      await onSaveConfig(payload)
      setAnnouncementText('')
      setIsActive(false)
      setIsScheduled(false)
      setLocalFeedback({ type: 'success', text: 'Đã gỡ bỏ thông báo khẩn khỏi hệ thống!' })
      setTimeout(() => setLocalFeedback(null), 3000)
    } catch (err) {
      setLocalFeedback({ type: 'error', text: 'Lỗi khi tắt thông báo.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBannerStyle = () => {
    switch (bannerType) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500 text-white',
          bannerBg: 'bg-rose-600 text-white shadow-lg shadow-rose-600/20',
          icon: <ShieldAlert className="w-4 h-4 shrink-0 text-white animate-bounce" />,
          label: 'Khẩn Cấp / Sự Cố',
        }
      case 'INFO':
        return {
          badge: 'bg-blue-500 text-white',
          bannerBg: 'bg-[#1877f2] text-white shadow-lg shadow-[#1877f2]/20',
          icon: <Info className="w-4 h-4 shrink-0 text-white" />,
          label: 'Thông Báo Chung',
        }
      default:
        return {
          badge: 'bg-amber-500 text-white',
          bannerBg: 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-medium',
          icon: <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />,
          label: 'Bảo Trì / Cảnh Báo',
        }
    }
  }

  const currentStyle = getBannerStyle()

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      {/* Header with Active State Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Thông Báo Khẩn Toàn Hệ Thống (Flash Banner)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phát thanh thông báo nổi bật trên đầu trang của toàn bộ người dùng và đặt lịch hẹn giờ phát sóng
            </p>
          </div>
        </div>

        <div>
          {isActive && !isScheduledInFuture ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đang phát trực tiếp
            </span>
          ) : isActive && isScheduledInFuture ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <Clock className="w-3.5 h-3.5" />
              Đã lên lịch ({new Date(scheduledTime).toLocaleDateString('vi-VN')})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Chưa kích hoạt
            </span>
          )}
        </div>
      </div>

      {/* Feedback Message */}
      {localFeedback && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold transition-all animate-in fade-in ${
            localFeedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {localFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{localFeedback.text}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* 1. Announcement Text Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Nội dung thông báo phát sóng:</span>
            <span className="text-[11px] text-slate-400 font-normal">
              {announcementText.length}/300 ký tự
            </span>
          </label>
          <textarea
            value={announcementText}
            maxLength={300}
            rows={3}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Ví dụ: Hệ thống sẽ tiến hành bảo trì máy chủ định kỳ từ 00:00 đến 02:00 ngày mai. Vui lòng lưu lại các tác vụ..."
            className="w-full bg-slate-50 dark:bg-[#18191a] text-xs text-slate-900 dark:text-[#e4e6eb] placeholder:text-slate-400 dark:placeholder:text-[#b0b3b8] p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] transition-all resize-none font-medium leading-relaxed"
          />
        </div>

        {/* 2. Type & Scheduling Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Severity Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Mức độ cảnh báo & Màu sắc Banner:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBannerType('INFO')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  bannerType === 'INFO'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#18191a] text-slate-600 dark:text-[#b0b3b8] border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Thông tin</span>
              </button>

              <button
                type="button"
                onClick={() => setBannerType('WARNING')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  bannerType === 'WARNING'
                    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#18191a] text-slate-600 dark:text-[#b0b3b8] border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Bảo trì</span>
              </button>

              <button
                type="button"
                onClick={() => setBannerType('CRITICAL')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  bannerType === 'CRITICAL'
                    ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#18191a] text-slate-600 dark:text-[#b0b3b8] border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Khẩn cấp</span>
              </button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Thời gian hiển thị (Tự động tắt sau):
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#18191a] text-xs font-semibold text-slate-800 dark:text-[#e4e6eb] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:border-[#1877f2] cursor-pointer"
            >
              <option value="1">1 Giờ</option>
              <option value="6">6 Giờ</option>
              <option value="12">12 Giờ</option>
              <option value="24">24 Giờ (1 Ngày)</option>
              <option value="72">3 Ngày</option>
              <option value="0">Vĩnh viễn (Chỉ tắt khi Admin gỡ bỏ)</option>
            </select>
          </div>
        </div>

        {/* 3. Scheduling Section */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Hẹn Giờ Phát Thông Báo (Scheduled Broadcast)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsScheduled(!isScheduled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isScheduled ? 'bg-[#1877f2]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${
                  isScheduled ? 'translate-x-5.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isScheduled && (
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-in fade-in">
              <div className="flex-1 space-y-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Chọn thời điểm bắt đầu hiển thị banner:
                </span>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-white dark:bg-[#242526] text-xs font-semibold text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-[#1877f2] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Live Preview Banner Box */}
        {announcementText.trim() && (
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-slate-400 dark:text-[#b0b3b8] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước giao diện Flash Banner phía người dùng:</span>
            </label>
            <div
              className={`p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs transition-all ${currentStyle.bannerBg}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {currentStyle.icon}
                <span className="font-semibold leading-relaxed truncate">
                  {announcementText}
                </span>
              </div>
              <span className="text-[10px] font-bold opacity-80 shrink-0 uppercase tracking-wider">
                [Đóng ✕]
              </span>
            </div>
          </div>
        )}

        {/* 5. Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeactivateAnnouncement}
              disabled={isSubmitting}
              className="text-rose-600 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Gỡ bỏ thông báo
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleSendAnnouncement}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isScheduled ? (
              <>
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Lưu lịch hẹn phát sóng
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Phát thông báo ngay
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SystemAnnouncementCard
