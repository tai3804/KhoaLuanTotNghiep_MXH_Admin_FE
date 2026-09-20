import React from 'react'
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react'
import { ServiceHealth } from '../../types/settings'
import Badge from '../common/Badge'

export interface SystemHealthCheckProps {
  services: ServiceHealth[]
}

export const SystemHealthCheck: React.FC<SystemHealthCheckProps> = ({ services }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#e4e6eb]">
              Trạng Thái Hệ Thống Microservices
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">
              Giám sát tình trạng hoạt động và độ trễ phản hồi của các cụm dịch vụ
            </p>
          </div>
        </div>

        <Badge variant="success" size="md" dot>
          Hệ thống ổn định
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] bg-slate-50/50 dark:bg-[#3a3b3c]/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#e4e6eb]">
                  {svc.name}
                </p>
                <p className="text-[11px] font-mono text-slate-400 dark:text-[#b0b3b8]">
                  Port :{svc.port}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {svc.status}
              </span>
              {svc.responseTimeMs && (
                <p className="text-[10px] text-slate-400 dark:text-[#b0b3b8] font-mono">
                  {svc.responseTimeMs}ms
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemHealthCheck
