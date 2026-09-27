import React, { useEffect, useState } from 'react'
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Server,
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
            <div className="p-2 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Cấu Hình Hệ Thống (System Settings)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quản lý các tham số vận hành mạng xã hội, kiểm duyệt AI và phân phối tài nguyên
              </p>
            </div>
          </div>
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
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Maintenance Mode Warning Banner */}
      {configs.maintenance_mode === 'true' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">
              Hệ thống đang ở chế độ Bảo trì (Maintenance Mode)
            </h4>
            <p className="text-xs text-amber-600/90 dark:text-amber-400/80 mt-1">
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
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>
            Mọi thay đổi cấu hình sẽ được lưu vết vào{' '}
            <strong>Nhật ký kiểm duyệt (Audit Log)</strong> với mã hành động{' '}
            <code>UPDATE_SYSTEM_CONFIG</code>.
          </span>
        </div>
        <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
          <Server className="w-4 h-4 text-emerald-500" />
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

