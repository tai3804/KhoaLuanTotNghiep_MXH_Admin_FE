import React, { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setReports,
  setSelectedReport,
  setFilter,
  resolveReportSuccess,
  setLoading,
  setActionLoading,
} from '../store/slices/reportSlice'
import { deletePostSuccess } from '../store/slices/postSlice'
import { addToast } from '../store/slices/toastSlice'
import { reportService } from '../services/reportService'
import { postService } from '../services/postService'
import ReportFilterBar from '../components/reports/ReportFilterBar'
import ReportTable from '../components/reports/ReportTable'
import ResolveReportModal from '../components/reports/ResolveReportModal'
import Pagination from '../components/common/Pagination'

export const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { reports, selectedReport, filter, isLoading, actionLoading } =
    useAppSelector((state) => state.report)

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      dispatch(setLoading(true))
      try {
        const data = await reportService.getAllReports()
        dispatch(setReports(data))
      } catch (e) {
        console.error('Failed to load reports:', e)
        dispatch(setReports([]))
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchReports()
  }, [dispatch])

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesType =
        !filter.targetType ||
        filter.targetType === 'ALL' ||
        r.targetType === filter.targetType

      const matchesStatus =
        !filter.status ||
        filter.status === 'ALL' ||
        r.status === filter.status

      return matchesType && matchesStatus
    })
  }, [reports, filter])

  const paginatedReports = useMemo(() => {
    const start = (filter.page - 1) * filter.limit
    return filteredReports.slice(start, start + filter.limit)
  }, [filteredReports, filter.page, filter.limit])

  const handleResolve = async (
    reportId: string | number,
    deleteTarget: boolean,
    action: string
  ) => {
    dispatch(setActionLoading(true))
    try {
      await reportService.resolveReport({
        reportId,
        deleteTarget,
        action: action as any,
      })

      if (deleteTarget && selectedReport?.targetType === 'POST') {
        await postService.deletePost(selectedReport.targetId)
        dispatch(deletePostSuccess(selectedReport.targetId))
      }

      const newStatus = action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED'
      dispatch(resolveReportSuccess({ reportId, status: newStatus }))

      dispatch(
        addToast({
          type: 'success',
          title: 'Đã xử lý báo cáo',
          message:
            action === 'DISMISS'
              ? 'Đã bác bỏ báo cáo vi phạm.'
              : 'Đã xử lý và gỡ nội dung vi phạm thành công.',
        })
      )
      setIsResolveModalOpen(false)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể xử lý báo cáo này.',
        })
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Trung Tâm Kiểm Duyệt & Báo Cáo Vi Phạm
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Đối soát nội dung bị thành viên khiếu nại, xem xét chứng cứ và thực hiện chế tài xử phạt
        </p>
      </div>

      <ReportFilterBar
        filter={filter}
        onChange={(newFilter) => dispatch(setFilter(newFilter))}
      />

      <ReportTable
        reports={paginatedReports}
        isLoading={isLoading}
        onResolveClick={(report) => {
          dispatch(setSelectedReport(report))
          setIsResolveModalOpen(true)
        }}
      />

      <Pagination
        currentPage={filter.page}
        totalItems={filteredReports.length}
        pageSize={filter.limit}
        onPageChange={(page) => dispatch(setFilter({ page }))}
      />

      <ResolveReportModal
        report={selectedReport}
        isOpen={isResolveModalOpen}
        isLoading={actionLoading}
        onClose={() => setIsResolveModalOpen(false)}
        onResolve={handleResolve}
      />
    </div>
  )
}

export default ReportsPage
