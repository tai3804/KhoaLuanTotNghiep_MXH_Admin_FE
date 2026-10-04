import React from 'react'
import { Activity } from 'lucide-react'
import { ServiceHealth } from '../../types/settings'
import Badge from '../common/Badge'

export interface SystemHealthCheckProps {
  services: ServiceHealth[]
}

export const SystemHealthCheck: React.FC<SystemHealthCheckProps> = ({ services }) => {
  const hasServices = services.length > 0
  const downCount = services.filter((s) => s.status === 'DOWN').length
  const isAllHealthy = hasServices && downCount === 0

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs space-y-4 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#DCFCE7] dark:bg-[#31A24C]/20 text-[#31A24C]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
              Trạng Thái Hệ Thống Microservices
            </h3>
            <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
              Giám sát tình trạng hoạt động và độ trễ phản hồi thời gian thực của các cụm dịch vụ
            </p>
          </div>
        </div>

        <Badge
          variant={!hasServices ? 'neutral' : isAllHealthy ? 'success' : 'danger'}
          size="md"
          dot={hasServices}
        >
          {!hasServices
            ? 'Chưa có dữ liệu kết nối'
            : isAllHealthy
            ? 'Hệ thống ổn định'
            : `Có ${downCount} dịch vụ gián đoạn`}
        </Badge>
      </div>

      {!hasServices ? (
        <div className="py-8 flex flex-col items-center justify-center text-[#65676B] dark:text-[#B0B3B8] gap-2 border border-dashed border-[#E4E6EB] dark:border-[#393A3B] rounded-xl">
          <Activity className="w-8 h-8 opacity-40 animate-pulse" />
          <span className="text-xs font-medium">Chưa nhận được phản hồi kiểm tra sức khỏe dịch vụ từ máy chủ</span>
          <span className="text-[11px] text-[#65676B] dark:text-[#B0B3B8]">Hệ thống đang kết nối hoặc các tiến trình dịch vụ đang khởi động</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {services.map((svc, idx) => {
            const isUp = svc.status === 'UP'

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isUp
                    ? 'border-[#E4E6EB] dark:border-[#393A3B] bg-[#F0F2F5]/60 dark:bg-[#3A3B3C]/40 hover:border-[#0866FF]/30'
                    : 'border-[#FA383E]/40 bg-[#FA383E]/10 dark:bg-[#FA383E]/15'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isUp ? 'bg-[#31A24C] animate-pulse' : 'bg-[#FA383E]'
                    }`}
                  />
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] truncate">
                      {svc.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#65676B] dark:text-[#B0B3B8]">
                      Port :{svc.port}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span
                    className={`text-xs font-bold ${
                      isUp
                        ? 'text-[#31A24C]'
                        : 'text-[#FA383E]'
                    }`}
                  >
                    {isUp ? 'UP' : 'DOWN'}
                  </span>
                  <p className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] font-mono">
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
      )}
    </div>
  )
}

export default SystemHealthCheck
