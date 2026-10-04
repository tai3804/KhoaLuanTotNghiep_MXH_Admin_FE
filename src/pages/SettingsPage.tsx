import React, { useEffect, useState } from 'react'
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Server,
  Settings,
} from 'lucide-react'
import { settingsService } from '../services/settingsService'
import Button from '../components/common/Button'
import ConfirmDialog from '../components/common/ConfirmDialog'
import GeneralConfigSection from '../components/settings/GeneralConfigSection'
import SystemAnnouncementCard from '../components/settings/SystemAnnouncementCard'
import SecurityConfigSection from '../components/settings/SecurityConfigSection'
import CacheManagerSection from '../components/settings/CacheManagerSection'

export const SettingsPage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({
    maintenance_mode: 'false',
    allow_registration: 'true',
    ai_moderation_enabled: 'true',
    max_upload_size_mb: '25',
    system_announcement: '',
    max_reports_auto_hide: '5',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const data = await settingsService.getSystemConfigs()
      setConfigs((prev) => ({ ...prev, ...data }))
    } catch (e) {
      console.error('Failed to load system configs:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = (key: string) => {
    setConfigs((prev) => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true',
    }))
  }

  const handleChange = (key: string, value: string) => {
    setConfigs((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setToastMessage(null)
    try {
      const updated = await settingsService.updateSystemConfigs(configs)
      setConfigs((prev) => ({ ...prev, ...updated }))
      setToastMessage({
        type: 'success',
        text: 'Cập nhật cấu hình hệ thống thành công!',
      })
      setTimeout(() => setToastMessage(null), 4000)
    } catch (e) {
      console.error('Failed to save configs:', e)
      setToastMessage({
        type: 'error',
        text: 'Lỗi khi lưu cấu hình. Vui lòng thử lại!',
      })
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetDefaults = () => {
    setIsResetDialogOpen(true)
  }

  const confirmResetDefaults = () => {
    setConfigs({
      maintenance_mode: 'false',
      allow_registration: 'true',
      ai_moderation_enabled: 'true',
      max_upload_size_mb: '25',
      system_announcement: '',
      max_reports_auto_hide: '5',
    })
    setIsResetDialogOpen(false)
    setToastMessage({
      type: 'success',
      text: 'Đã khôi phục các giá trị cấu hình mặc định (nhấn Lưu để áp dụng).',
    })
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-[#050505] dark:text-[#E4E6EB] tracking-tight flex items-center gap-2.5">
              <Settings className="w-7 h-7 text-[#0866FF] dark:text-[#2D88FF]" />
              Cấu Hình Hệ Thống (System Settings)
            </h2>
          </div>
          <p className="text-sm text-[#65676B] dark:text-[#B0B3B8] mt-1">
            Quản lý các tham số vận hành mạng xã hội, kiểm duyệt AI và phân phối tài nguyên
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            disabled={isSaving || isLoading}
          >
            Mặc định
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            disabled={isLoading}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'success'
              ? 'bg-[#DCFCE7] dark:bg-[#31A24C]/20 border border-[#31A24C]/30 text-[#31A24C] dark:text-[#31A24C]'
              : 'bg-[#FEE2E2] dark:bg-[#FA383E]/20 border border-[#FA383E]/30 text-[#FA383E]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#31A24C]" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#FA383E]" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Maintenance Mode Warning Banner */}
      {configs.maintenance_mode === 'true' && (
        <div className="p-4 rounded-2xl bg-[#FEF3C7] dark:bg-[#F5C33B]/15 border-2 border-[#F5C33B]/40 flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-[#B78103] dark:text-[#F5C33B] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-[#B78103] dark:text-[#F5C33B]">
              Hệ thống đang ở chế độ Bảo trì (Maintenance Mode)
            </h4>
            <p className="text-xs text-[#B78103]/90 dark:text-[#F5C33B]/80 mt-1">
              Người dùng thông thường sẽ không thể đăng nhập hoặc tương tác với mạng xã hội. Chỉ quản trị viên mới có thể truy cập hệ thống.
            </p>
          </div>
        </div>
      )}

      {/* Modular Settings Sections */}
      <GeneralConfigSection
        configs={configs}
        onToggle={handleToggle}
        onChange={handleChange}
      />

      <SystemAnnouncementCard
        configs={configs}
        onSaveConfig={async (updated) => {
          setConfigs(updated)
          await settingsService.updateSystemConfigs(updated)
        }}
      />

      <SecurityConfigSection
        configs={configs}
        onToggle={handleToggle}
        onChange={handleChange}
      />

      <CacheManagerSection />

      {/* Audit Log Footer Note */}
      <div className="p-4 rounded-2xl bg-[#F0F2F5] dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] flex items-center justify-between text-xs text-[#65676B] dark:text-[#B0B3B8]">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#65676B] dark:text-[#B0B3B8]" />
          <span>
            Mọi thay đổi cấu hình sẽ được lưu vết vào{' '}
            <strong className="text-[#050505] dark:text-[#E4E6EB]">Nhật ký kiểm duyệt (Audit Log)</strong> với mã hành động{' '}
            <code className="text-[#0866FF] dark:text-[#2D88FF] font-mono">UPDATE_SYSTEM_CONFIG</code>.
          </span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[#050505] dark:text-[#E4E6EB]">
          <Server className="w-4 h-4 text-[#31A24C]" />
          <span>Admin Service Active</span>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={confirmResetDefaults}
        title="Khôi phục cấu hình mặc định"
        message="Bạn có chắc chắn muốn đặt lại tất cả các tham số cấu hình hệ thống về giá trị ban đầu? Các thay đổi chưa lưu sẽ bị xóa."
        confirmText="Đặt lại mặc định"
        cancelText="Hủy bỏ"
        isDangerous={true}
      />
    </div>
  )
}

export default SettingsPage

