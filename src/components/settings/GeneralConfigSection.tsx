import React from 'react'
import { Server, HardDrive } from 'lucide-react'

interface GeneralConfigSectionProps {
  configs: Record<string, string>
  onToggle: (key: string) => void
  onChange: (key: string, value: string) => void
}

export const GeneralConfigSection: React.FC<GeneralConfigSectionProps> = ({
  configs,
  onToggle,
  onChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1877f2]">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Cấu Hình Hệ Thống Chung
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quản lý chế độ bảo trì, quyền đăng ký và giới hạn tài nguyên mạng xã hội
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Maintenance Mode */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Chế độ Bảo Trì Hệ Thống (Maintenance Mode)
              </span>
              {configs.maintenance_mode === 'true' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] animate-pulse">
                  ĐANG BẢO TRÌ
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Khi bật, người dùng thông thường sẽ thấy trang thông báo bảo trì, chỉ tài khoản Admin mới có thể truy cập hệ thống.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('maintenance_mode')}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
              configs.maintenance_mode === 'true'
                ? 'bg-amber-500'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                configs.maintenance_mode === 'true'
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Allow Registration */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5 max-w-xl">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Cho Phép Đăng Ký Tài Khoản Mới
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bật hoặc tắt tính năng đăng ký tài khoản mới trên ứng dụng client.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('allow_registration')}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
              configs.allow_registration === 'true'
                ? 'bg-[#1877f2]'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                configs.allow_registration === 'true'
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Max Upload Size */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold text-slate-900 dark:text-white">
                Giới Hạn Dung Lượng Tải Lên (Media Upload Limit)
              </label>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {configs.max_upload_size_mb || '25'} MB
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={configs.max_upload_size_mb || '25'}
            onChange={(e) => onChange('max_upload_size_mb', e.target.value)}
            className="w-full accent-[#1877f2] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>5 MB (Tiết kiệm)</span>
            <span>25 MB (Chuẩn)</span>
            <span>50 MB</span>
            <span>100 MB (Tối đa)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralConfigSection
