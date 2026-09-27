import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setBlacklist,
  addBlacklistWordSuccess,
  removeBlacklistWordSuccess,
  setLoading,
  setActionLoading,
} from '../store/slices/settingsSlice'
import { addToast } from '../store/slices/toastSlice'
import { settingsService } from '../services/settingsService'
import BlacklistWordManager from '../components/settings/BlacklistWordManager'

export const BlacklistPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { blacklist, isLoading, actionLoading } = useAppSelector(
    (state) => state.settings
  )

  useEffect(() => {
    const fetchBlacklist = async () => {
      if (blacklist.length === 0) {
        dispatch(setLoading(true))
      }
      try {
        const data = await settingsService.getBlacklist()
        dispatch(setBlacklist(data))
      } catch (e) {
        console.error('Failed to load blacklist:', e)
        if (blacklist.length === 0) {
          dispatch(setBlacklist([]))
        }
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchBlacklist()
  }, [dispatch, blacklist.length])

  const handleAddWord = async (word: string) => {
    dispatch(setActionLoading(true))
    try {
      const added = await settingsService.addBlacklistWord(word)
      dispatch(addBlacklistWordSuccess(added))
      dispatch(
        addToast({
          type: 'success',
          title: 'Đã thêm từ khóa',
          message: `Đã thêm "${word}" vào bộ lọc từ khóa cấm.`,
        })
      )
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể thêm từ khóa này.',
        })
      )
    }
  }

  const handleRemoveWord = async (id: number | string) => {
    dispatch(setActionLoading(true))
    try {
      await settingsService.removeBlacklistWord(id)
      dispatch(removeBlacklistWordSuccess(id))
      dispatch(
        addToast({
          type: 'info',
          title: 'Đã xóa từ khóa',
          message: 'Từ khóa đã được gỡ khỏi danh sách blacklist.',
        })
      )
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể xóa từ khóa này.',
        })
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Cấu Hình Từ Điển Từ Cấm
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Quản lý các cụm từ nhạy cảm, lừa đảo hoặc thù ghét để hệ thống tự động kiểm duyệt
        </p>
      </div>

      <BlacklistWordManager
        words={blacklist}
        isLoading={actionLoading || isLoading}
        onAddWord={handleAddWord}
        onRemoveWord={handleRemoveWord}
      />
    </div>
  )
}

export default BlacklistPage
