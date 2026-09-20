import React, { useState } from 'react'
import { Report } from '../../types/report'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { AlertTriangle, Trash2, ShieldBan, CheckCircle, XCircle } from 'lucide-react'

export interface ResolveReportModalProps {
  report: Report | null
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onResolve: (reportId: string | number, deleteTarget: boolean, action: string) => void
}

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  report,
  isOpen,
  isLoading = false,
  onClose,
  onResolve,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(true)

  if (!report) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Xử Lý Báo Cáo #${report.id}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResolve(report.id, false, 'DISMISS')}
            disabled={isLoading}
          >
            <XCircle className="w-4 h-4 mr-1 text-slate-400" />
            Bác Bỏ Báo Cáo (Không Phạt)
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => onResolve(report.id, deleteTarget, 'DELETE_AND_RESOLVE')}
              isLoading={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Chấp Nhận & Gỡ Nội Dung
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Report Overview */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#3a3b3c]/40 border border-[#e4e6eb] dark:border-[#393a3b] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-[#b0b3b8]">Đối tượng:</span>
              <Badge variant="primary" size="sm">
                {report.targetType} #{report.targetId}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-[#b0b3b8]">Lý do:</span>
              <Badge variant="danger" size="sm">
                {report.reason}
              </Badge>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-[#b0b3b8]">Mô tả từ người báo cáo:</span>
            <p className="text-xs text-slate-800 dark:text-[#e4e6eb] mt-1 italic">
              "{report.description || 'Không có ghi chú thêm.'}"
            </p>
          </div>
        </div>

        {/* Content Snapshot / Evidence */}
        {report.targetData && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Nội Dung Bị Khiếu Nại (Snapshot):</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-[#e4e6eb] whitespace-pre-line">
              {report.targetData.content || JSON.stringify(report.targetData)}
            </p>
          </div>
        )}

        {/* Action Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-[#e4e6eb] font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={deleteTarget}
              onChange={(e) => setDeleteTarget(e.target.checked)}
              className="w-4 h-4 rounded-md text-[#1877f2] focus:ring-[#1877f2]"
            />
            <span>Đồng thời xóa vĩnh viễn bài viết/nội dung mục tiêu khỏi hệ thống</span>
          </label>
        </div>
      </div>
    </Modal>
  )
}

export default ResolveReportModal
