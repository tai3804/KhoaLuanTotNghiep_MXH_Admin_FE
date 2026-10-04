import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import Button from '../components/common/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-3xl bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] dark:text-[#2D88FF]">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold text-[#050505] dark:text-[#E4E6EB]">
        404 - Không Tìm Thấy Trang
      </h2>
      <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] max-w-sm">
        Đường dẫn bạn yêu cầu không tồn tại trong hệ thống quản trị KLTN Social.
      </p>
      <Link to="/">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Về Trang Tổng Quan
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
