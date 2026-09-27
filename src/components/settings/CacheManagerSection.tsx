import React, { useState } from 'react'
import { Database, Trash2, RefreshCw, CheckCheck, Sparkles } from 'lucide-react'
import Button from '../common/Button'

export const CacheManagerSection: React.FC = () => {
  const [clearing, setClearing] = useState<string | null>(null)
  const [cleared, setCleared] = useState<string | null>(null)

  const handleClearCache = (key: string) => {
    setClearing(key)
    setTimeout(() => {
      setClearing(null)
      setCleared(key)
      setTimeout(() => setCleared(null), 3000)
    }, 600)
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Quản Lý Bộ Nhớ Đệm (Redis Cache & Memory)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dọn dẹp và làm mới bộ nhớ đệm để đảm bảo dữ liệu hiển thị tức thì trên toàn mạng xã hội
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cache Blacklist */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Cache Danh Mục Từ Cấm
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Đồng bộ lại danh sách từ cấm sang Redis cho bộ lọc bài viết.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClearCache('blacklist')}
            isLoading={clearing === 'blacklist'}
            leftIcon={
              cleared === 'blacklist' ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )
            }
          >
            {cleared === 'blacklist' ? 'Đã Xóa Cache' : 'Xóa Cache Từ Cấm'}
          </Button>
        </div>

        {/* Cache Trending */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Cache Bảng Tin & Xu Hướng
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Xóa cache danh sách bài viết nổi bật và hashtag thịnh hành.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClearCache('posts')}
            isLoading={clearing === 'posts'}
            leftIcon={
              cleared === 'posts' ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )
            }
          >
            {cleared === 'posts' ? 'Đã Xóa Cache' : 'Xóa Cache Bài Viết'}
          </Button>
        </div>

        {/* Cache Token Version */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1c1e21] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Đồng Bộ Token Revocation
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Kiểm tra tình trạng danh sách tokenVersion trên Redis Server.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClearCache('token')}
            isLoading={clearing === 'token'}
            leftIcon={
              cleared === 'token' ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )
            }
          >
            {cleared === 'token' ? 'Đã Đồng Bộ' : 'Đồng Bộ Token Cache'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CacheManagerSection
