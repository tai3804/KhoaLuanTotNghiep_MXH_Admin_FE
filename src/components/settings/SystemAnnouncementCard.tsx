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
          badge: 'bg-[#FA383E] text-white',
          bannerBg: 'bg-[#FA383E] text-white shadow-xs',
          icon: <ShieldAlert className="w-4 h-4 shrink-0 text-white animate-bounce" />,
          label: 'Khẩn Cấp / Sự Cố',
        }
      case 'INFO':
        return {
          badge: 'bg-[#0866FF] text-white',
          bannerBg: 'bg-[#0866FF] text-white shadow-xs',
          icon: <Info className="w-4 h-4 shrink-0 text-white" />,
          label: 'Thông Báo Chung',
        }
      default:
        return {
          badge: 'bg-[#F5C33B] text-black font-semibold',
          bannerBg: 'bg-[#F5C33B] text-black shadow-xs font-semibold',
          icon: <AlertTriangle className="w-4 h-4 shrink-0 text-black" />,
          label: 'Bảo Trì / Cảnh Báo',
        }
    }
  }

  const currentStyle = getBannerStyle()

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-6">
      {/* Header with Active State Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4E6EB] dark:border-[#393A3B]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FEF3C7] dark:bg-[#F5C33B]/20 text-[#B78103] dark:text-[#F5C33B]">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
                Thông Báo Khẩn Toàn Hệ Thống (Flash Banner)
              </h3>
            </div>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Phát thanh thông báo nổi bật trên đầu trang của toàn bộ người dùng và đặt lịch hẹn giờ phát sóng
            </p>
          </div>
        </div>

        <div>
          {isActive && !isScheduledInFuture ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] dark:bg-[#31A24C]/20 border border-[#31A24C]/30 text-[#31A24C]">
              <span className="w-2 h-2 rounded-full bg-[#31A24C] animate-pulse" />
              Đang phát trực tiếp
            </span>
          ) : isActive && isScheduledInFuture ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E7F3FF] dark:bg-[#0866FF]/20 border border-[#0866FF]/30 text-[#0866FF] dark:text-[#2D88FF]">
              <Clock className="w-3.5 h-3.5" />
              Đã lên lịch ({new Date(scheduledTime).toLocaleDateString('vi-VN')})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8]">
              <span className="w-2 h-2 rounded-full bg-[#65676B]" />
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
              ? 'bg-[#DCFCE7] dark:bg-[#31A24C]/20 text-[#31A24C] border border-[#31A24C]/30'
              : 'bg-[#FEE2E2] dark:bg-[#FA383E]/20 text-[#FA383E] border border-[#FA383E]/30'
          }`}
        >
          {localFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#31A24C]" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#FA383E]" />
          )}
          <span>{localFeedback.text}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* 1. Announcement Text Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center justify-between">
            <span>Nội dung thông báo phát sóng:</span>
            <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] font-normal">
              {announcementText.length}/300 ký tự
            </span>
          </label>
          <textarea
            value={announcementText}
            maxLength={300}
            rows={3}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Ví dụ: Hệ thống sẽ tiến hành bảo trì máy chủ định kỳ từ 00:00 đến 02:00 ngày mai. Vui lòng lưu lại các tác vụ..."
            className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs text-[#050505] dark:text-[#E4E6EB] placeholder-[#65676B] dark:placeholder-[#B0B3B8] p-3 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 focus:border-[#0866FF] transition-all resize-none font-medium leading-relaxed"
          />
        </div>

        {/* 2. Type & Scheduling Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Severity Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Mức độ cảnh báo & Màu sắc Banner:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBannerType('INFO')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  bannerType === 'INFO'
                    ? 'bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] dark:text-[#2D88FF] border-[#0866FF]'
                    : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] border-[#E4E6EB] dark:border-[#393A3B]'
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
                    ? 'bg-[#FEF3C7] dark:bg-[#F5C33B]/20 text-[#B78103] dark:text-[#F5C33B] border-[#F5C33B]'
                    : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] border-[#E4E6EB] dark:border-[#393A3B]'
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
                    ? 'bg-[#FEE2E2] dark:bg-[#FA383E]/20 text-[#FA383E] border-[#FA383E]'
                    : 'bg-[#F0F2F5] dark:bg-[#3A3B3C] text-[#65676B] dark:text-[#B0B3B8] border-[#E4E6EB] dark:border-[#393A3B]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Khẩn cấp</span>
              </button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Thời gian hiển thị (Tự động tắt sau):
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className="w-full bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] px-3.5 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 cursor-pointer"
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
        <div className="p-4 rounded-xl bg-[#F0F2F5]/70 dark:bg-[#3A3B3C]/30 border border-[#E4E6EB] dark:border-[#393A3B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0866FF] dark:text-[#2D88FF]" />
              <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                Hẹn Giờ Phát Thông Báo (Scheduled Broadcast)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsScheduled(!isScheduled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isScheduled ? 'bg-[#0866FF]' : 'bg-[#CED0D4] dark:bg-[#3A3B3C]'
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
                <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] font-medium">
                  Chọn thời điểm bắt đầu hiển thị banner:
                </span>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-white dark:bg-[#242526] text-xs font-semibold text-[#050505] dark:text-[#E4E6EB] px-3.5 py-2 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/20 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Live Preview Banner Box */}
        {announcementText.trim() && (
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] uppercase tracking-wider flex items-center gap-1.5">
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
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#E4E6EB] dark:border-[#393A3B]">
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeactivateAnnouncement}
              disabled={isSubmitting}
              className="text-[#FA383E] border-[#FA383E]/40 hover:bg-[#FA383E]/10 cursor-pointer"
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
