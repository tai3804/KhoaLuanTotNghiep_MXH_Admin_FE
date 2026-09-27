import React from 'react'
import { Activity } from 'lucide-react'
import { ServiceHealth } from '../../types/settings'
import Badge from '../common/Badge'

export interface SystemHealthCheckProps {
  services: ServiceHealth[]
}

export const SystemHealthCheck: React.FC<SystemHealthCheckProps> = ({ services }) => {
  const downCount = services.filter((s) => s.status === 'DOWN').length
  const isAllHealthy = services.length > 0 && downCount === 0

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs space-y-4 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#e4e6eb]">
              Trạng Thái Hệ Thống Microservices
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#b0b3b8]">
              Giám sát tình trạng hoạt động và độ trễ phản hồi thời gian thực của các cụm dịch vụ
            </p>
          </div>
        </div>

        <Badge variant={isAllHealthy ? 'success' : 'danger'} size="md" dot>
          {isAllHealthy ? 'Hệ thống ổn định' : `Có ${downCount} dịch vụ gián đoạn`}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {services.map((svc, idx) => {
          const isUp = svc.status === 'UP'

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                isUp
                  ? 'border-[#e4e6eb] dark:border-[#393a3b] bg-slate-50/60 dark:bg-[#3a3b3c]/40 hover:border-[#1877f2]/30'
                  : 'border-rose-300 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isUp ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <div className="min-w-0 truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-[#e4e6eb] truncate">
                    {svc.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 dark:text-[#b0b3b8]">
                    Port :{svc.port}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span
                  className={`text-xs font-bold ${
                    isUp
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isUp ? 'UP' : 'DOWN'}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-[#b0b3b8] font-mono">
                  {isUp
                    ? svc.responseTimeMs && svc.responseTimeMs > 0
                      ? `${svc.responseTimeMs}ms`
                      : '< 1ms'
                    : 'Offline'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SystemHealthCheck
