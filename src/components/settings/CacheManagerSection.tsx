import React, { useState } from 'react'
import { Database, RefreshCw, CheckCheck } from 'lucide-react'
import Button from '../common/Button'
import { settingsService } from '../../services/settingsService'

export const CacheManagerSection: React.FC = () => {
  const [clearing, setClearing] = useState<string | null>(null)
  const [cleared, setCleared] = useState<string | null>(null)

  const handleClearCache = async (key: string) => {
    setClearing(key)
    try {
      await settingsService.clearCache(key)
      setCleared(key)
      setTimeout(() => setCleared(null), 3000)
    } catch (e) {
      console.error('Failed to clear cache:', e)
    } finally {
      setClearing(null)
    }
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#E4E6EB] dark:border-[#393A3B] p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E4E6EB] dark:border-[#393A3B]">
        <div className="p-2 rounded-xl bg-[#DCFCE7] dark:bg-[#31A24C]/20 text-[#31A24C]">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
            Quản Lý Bộ Nhớ Đệm (Redis Cache & Memory)
          </h3>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
            Dọn dẹp và làm mới bộ nhớ đệm để đảm bảo dữ liệu hiển thị tức thì trên toàn mạng xã hội
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cache Blacklist */}
        <div className="p-4 rounded-xl bg-[#F0F2F5]/70 dark:bg-[#3A3B3C]/30 border border-[#E4E6EB] dark:border-[#393A3B] flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Cache Danh Mục Từ Cấm
            </h4>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
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
                <CheckCheck className="w-3.5 h-3.5 text-[#31A24C]" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )
            }
          >
            {cleared === 'blacklist' ? 'Đã Xóa Cache' : 'Xóa Cache Từ Cấm'}
          </Button>
        </div>

        {/* Cache Trending */}
        <div className="p-4 rounded-xl bg-[#F0F2F5]/70 dark:bg-[#3A3B3C]/30 border border-[#E4E6EB] dark:border-[#393A3B] flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Cache Bảng Tin & Xu Hướng
            </h4>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
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
                <CheckCheck className="w-3.5 h-3.5 text-[#31A24C]" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )
            }
          >
            {cleared === 'posts' ? 'Đã Xóa Cache' : 'Xóa Cache Bài Viết'}
          </Button>
        </div>

        {/* Cache Token Version */}
        <div className="p-4 rounded-xl bg-[#F0F2F5]/70 dark:bg-[#3A3B3C]/30 border border-[#E4E6EB] dark:border-[#393A3B] flex flex-col justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
              Đồng Bộ Token Revocation
            </h4>
            <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] mt-1">
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
                <CheckCheck className="w-3.5 h-3.5 text-[#31A24C]" />
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
