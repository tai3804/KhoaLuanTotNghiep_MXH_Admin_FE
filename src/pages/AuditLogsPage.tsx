import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { setAuditLogs, setServiceHealth, setLoading } from '../store/slices/settingsSlice'
import { settingsService } from '../services/settingsService'
import AuditLogViewer from '../components/settings/AuditLogViewer'
import SystemHealthCheck from '../components/settings/SystemHealthCheck'

export const AuditLogsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { auditLogs, services, isLoading } = useAppSelector(
    (state) => state.settings
  )

  useEffect(() => {
    const fetchLogs = async () => {
      dispatch(setLoading(true))
      try {
        const [logsData, healthData] = await Promise.all([
          settingsService.getAuditLogs(),
          settingsService.getServiceHealth()
        ])
        dispatch(setAuditLogs(logsData))
        dispatch(setServiceHealth(healthData))
      } catch (e) {
        console.error('Failed to load audit logs:', e)
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
  }, [dispatch])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Nhật Ký Hệ Thống & Giám Sát Dịch Vụ
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi nhật ký kiểm duyệt của ban quản trị và trạng thái các cụm microservices
        </p>
      </div>

      <SystemHealthCheck services={services} />

      <AuditLogViewer logs={auditLogs} isLoading={isLoading} />
    </div>
  )
}

export default AuditLogsPage
