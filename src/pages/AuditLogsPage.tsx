import React, { useEffect, useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setAuditLogs,
  setServiceHealth,
  setLoading,
} from '../store/slices/settingsSlice'
import { settingsService } from '../services/settingsService'
import AuditLogViewer from '../components/settings/AuditLogViewer'
import AuditLogFilterBar, {
  AuditLogFilter,
} from '../components/settings/AuditLogFilterBar'
import SystemHealthCheck from '../components/settings/SystemHealthCheck'
import Pagination from '../components/common/Pagination'
import Button from '../components/common/Button'

export const AuditLogsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { auditLogs, services, isLoading } = useAppSelector(
    (state) => state.settings
  )

  const [page, setPage] = useState(1)
  const pageSize = 10
  const [filter, setFilter] = useState<AuditLogFilter>({
    search: '',
    action: 'ALL',
    targetType: 'ALL',
  })

  useEffect(() => {
    const fetchLogs = async () => {
      if (auditLogs.length === 0) {
        dispatch(setLoading(true))
      }
      try {
        const [logsData, healthData] = await Promise.all([
          settingsService.getAuditLogs(),
          settingsService.getServiceHealth(),
        ])
        dispatch(setAuditLogs(logsData))
        dispatch(setServiceHealth(healthData))
      } catch (e) {
        console.error('Failed to load audit logs:', e)
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchLogs()

    // Poll service health every 30 seconds
    const intervalId = setInterval(async () => {
      try {
        const healthData = await settingsService.getServiceHealth()
        if (healthData && healthData.length > 0) {
          dispatch(setServiceHealth(healthData))
        }
      } catch (e) {
        console.error('Failed to poll service health:', e)
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [dispatch, auditLogs.length])

  // Extract unique actions list
  const actionsList = useMemo(() => {
    return Array.from(new Set(auditLogs.map((l) => l.action))).filter(Boolean)
  }, [auditLogs])

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const searchLower = filter.search.toLowerCase()
      const matchesSearch =
        filter.search === '' ||
        log.adminUsername?.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower) ||
        log.details?.toLowerCase().includes(searchLower) ||
        log.targetType?.toLowerCase().includes(searchLower) ||
        log.targetId?.toLowerCase().includes(searchLower)

      const matchesAction =
        filter.action === 'ALL' || log.action === filter.action

      return matchesSearch && matchesAction
    })
  }, [auditLogs, filter])

  // Paginated slice
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredLogs.slice(start, start + pageSize)
  }, [filteredLogs, page, pageSize])

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return
    const headers = [
      'Thời Gian',
      'Quản Trị Viên',
      'Hành Động',
      'Đối Tượng',
      'ID Mục Tiêu',
      'Chi Tiết',
      'IP',
    ]
    const rows = filteredLogs.map((l) => [
      l.createdAt ? `"${new Date(l.createdAt).toLocaleString('vi-VN')}"` : '""',
      `"${l.adminUsername}"`,
      `"${l.action}"`,
      `"${l.targetType}"`,
      `"${l.targetId}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.ipAddress || '127.0.0.1'}"`,
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `nhat_ky_kiem_duyet_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Nhật Ký Hệ Thống & Giám Sát Dịch Vụ
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi nhật ký kiểm duyệt của ban quản trị và trạng thái các cụm microservices
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Xuất Nhật Ký CSV
        </Button>
      </div>

      <SystemHealthCheck services={services} />

      {/* Filter and Search */}
      <AuditLogFilterBar
        filter={filter}
        onChange={(newFilter) => {
          setFilter(newFilter)
          setPage(1)
        }}
        actionsList={actionsList}
      />

      {/* Audit Log Table */}
      <AuditLogViewer logs={paginatedLogs} isLoading={isLoading} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalItems={filteredLogs.length}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  )
}

export default AuditLogsPage
