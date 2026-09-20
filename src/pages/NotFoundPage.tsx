import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import Button from '../components/common/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-500">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
        404 - Không Tìm Thấy Trang
      </h2>
      <p className="text-xs text-slate-500 max-w-sm">
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
