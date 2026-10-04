import React from 'react'
import { Shield, Sparkles, AlertTriangle } from 'lucide-react'

interface SecurityConfigSectionProps {
  configs: Record<string, string>
  onToggle: (key: string) => void
  onChange: (key: string, value: string) => void
}

export const SecurityConfigSection: React.FC<SecurityConfigSectionProps> = ({
  configs,
  onToggle,
  onChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E4E6EB] dark:border-[#393A3B]">
        <div className="p-2 rounded-xl bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] dark:text-[#2D88FF]">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
            Bảo Mật & Kiểm Duyệt Tự Động (AI Moderation)
          </h3>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
            Cấu hình bộ lọc từ cấm, ngưỡng cảnh báo và các quy tắc kiểm duyệt nội dung
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* AI Moderation Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F0F2F5]/70 dark:bg-[#3A3B3C]/30 border border-[#E4E6EB] dark:border-[#393A3B]">
          <div className="space-y-0.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                Bật Tính Năng Tự Động Quét Nội Dung Bằng AI
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E7F3FF] text-[#0866FF] dark:bg-[#0866FF]/20 dark:text-[#2D88FF] font-bold text-[10px] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Engine
              </span>
            </div>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Tự động đối chiếu bài viết mới với danh mục từ cấm (Blacklist) và gắn nhãn cảnh báo vi phạm trước khi xuất hiện trên Bảng tin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('ai_moderation_enabled')}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
              configs.ai_moderation_enabled === 'true'
                ? 'bg-[#0866FF]'
                : 'bg-[#CED0D4] dark:bg-[#3A3B3C]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.75 transition-transform shadow-xs ${
                configs.ai_moderation_enabled === 'true'
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Auto Hide Threshold */}
        <div className="p-4 rounded-xl bg-[#F0F2F5]/70 dark:bg-[#3A3B3C]/30 border border-[#E4E6EB] dark:border-[#393A3B] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FA383E]" />
              <label className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
                Ngưỡng Tự Động Ẩn Bài Viết Bị Báo Cáo (Auto-Hide Reports Threshold)
              </label>
            </div>
            <span className="text-xs font-bold text-[#FA383E]">
              {configs.max_reports_auto_hide || '5'} lượt báo cáo
            </span>
          </div>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
            Nếu một bài viết nhận đủ số lượt báo cáo từ những người dùng khác nhau vượt mức này, bài viết sẽ tạm thời bị ẩn khỏi Newsfeed để chờ Admin duyệt.
          </p>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={configs.max_reports_auto_hide || '5'}
            onChange={(e) => onChange('max_reports_auto_hide', e.target.value)}
            className="w-full accent-[#FA383E] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#65676B] dark:text-[#B0B3B8] font-semibold">
            <span>2 lượt (Nghiêm ngặt)</span>
            <span>5 lượt (Khuyến nghị)</span>
            <span>10 lượt</span>
            <span>20 lượt (Rộng rãi)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityConfigSection
