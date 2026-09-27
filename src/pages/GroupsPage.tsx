import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setGroups,
  deleteGroupSuccess,
  setLoading,
  setActionLoading,
} from '../store/slices/groupSlice'
import { addToast } from '../store/slices/toastSlice'
import { groupService } from '../services/groupService'
import { Group } from '../types/group'
import GroupTable from '../components/groups/GroupTable'
import ConfirmDialog from '../components/common/ConfirmDialog'

export const GroupsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { groups, isLoading, actionLoading } = useAppSelector(
    (state) => state.group
  )
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      if (groups.length === 0) {
        dispatch(setLoading(true))
      }
      try {
        const data = await groupService.getAllGroups()
        dispatch(setGroups(data))
      } catch (e) {
        console.error('Failed to load groups:', e)
        if (groups.length === 0) {
          dispatch(setGroups([]))
        }
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchGroups()
  }, [dispatch, groups.length])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    dispatch(setActionLoading(true))
    try {
      await groupService.deleteGroup(deleteTarget.id)
      dispatch(deleteGroupSuccess(deleteTarget.id))
      dispatch(
        addToast({
          type: 'success',
          title: 'Đã giải tán nhóm',
          message: `Hội nhóm "${deleteTarget.name}" đã được giải tán thành công.`,
        })
      )
      setDeleteTarget(null)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể giải tán nhóm này.',
        })
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Quản Lý Hội Nhóm & Cộng Đồng
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi các nhóm được tạo bởi người dùng, số lượng thành viên và xử lý giải tán nhóm vi phạm
        </p>
      </div>

      <GroupTable
        groups={groups}
        isLoading={isLoading}
        onDeleteClick={(group) => setDeleteTarget(group)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Giải Tán Hội Nhóm"
        message={`Bạn có chắc chắn muốn giải tán vĩnh viễn nhóm "${deleteTarget?.name}"? Toàn bộ bài thảo luận trong nhóm sẽ bị gỡ bỏ.`}
        confirmText="Giải Tán Nhóm"
        isDangerous
        isLoading={actionLoading}
      />
    </div>
  )
}

export default GroupsPage
