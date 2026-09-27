import React, { useState, useEffect } from 'react'
import { Report } from '../../types/report'
import { reportService } from '../../services/reportService'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Badge from '../common/Badge'
import {
  AlertTriangle,
  Trash2,
  XCircle,
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Lock,
  Users,
  Loader2,
  User as UserIcon,
  Calendar,
  Eye,
  X
} from 'lucide-react'

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
  const [targetDetail, setTargetDetail] = useState<any>(null)
  const [isLoadingTarget, setIsLoadingTarget] = useState(false)
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !report) {
      setTargetDetail(null)
      setPreviewMediaUrl(null)
      return
    }

    // If report already has detailed targetData, use it
    if (report.targetData && typeof report.targetData === 'object' && Object.keys(report.targetData).length > 0) {
      setTargetDetail(report.targetData)
      return
    }

    // Otherwise, asynchronously fetch live target data
    let isMounted = true
    const fetchTarget = async () => {
      setIsLoadingTarget(true)
      try {
        const data = await reportService.getTargetDetail(report.targetType, report.targetId)
        if (isMounted) {
          setTargetDetail(data)
        }
      } catch (err) {
        console.warn('Failed to load target details:', err)
      } finally {
        if (isMounted) {
          setIsLoadingTarget(false)
        }
      }
    }

    fetchTarget()
    return () => {
      isMounted = false
    }
  }, [isOpen, report])

  if (!report) return null

  const renderPostPreview = () => {
    if (isLoadingTarget) {
      return (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#242526] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-[#1877f2] animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Đang tải nội dung bài viết bị khiếu nại...</p>
        </div>
      )
    }

    if (!targetDetail) {
      return (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold">Không tìm thấy bài viết mục tiêu (ID: #{report.targetId})</p>
            <p className="text-[11px] mt-0.5 text-amber-600 dark:text-amber-300">
              Bài viết có thể đã bị tác giả tự xóa hoặc đã được hệ thống xử lý trước đó. Bạn vẫn có thể đóng hoặc xác nhận hoàn tất báo cáo này.
            </p>
          </div>
        </div>
      )
    }

    const mediaList: string[] = targetDetail.mediaUrls || targetDetail.mediaList || []
    const author = targetDetail.author || {}

    return (
      <div className="rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Post Author Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1c1e21]/40">
          <div className="flex items-center gap-3">
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.fullName || 'Tác giả'}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {(author.fullName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {author.fullName || 'Thành viên'}
                </span>
                {author.username && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    @{author.username}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{targetDetail.createdAt ? new Date(targetDetail.createdAt).toLocaleString('vi-VN') : 'Gần đây'}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                  {targetDetail.privacy === 'PUBLIC' ? (
                    <>
                      <Globe className="w-3 h-3" /> Công khai
                    </>
                  ) : targetDetail.privacy === 'FRIENDS' ? (
                    <>
                      <Users className="w-3 h-3" /> Bạn bè
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> Riêng tư
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <Badge variant={targetDetail.status === 'DELETED' ? 'danger' : 'success'} size="sm">
            {targetDetail.status || 'ACTIVE'}
          </Badge>
        </div>

        {/* Post Text Content */}
        <div className="p-4 space-y-3">
          {targetDetail.content ? (
            <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed selection:bg-rose-500/20">
              {targetDetail.content}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic">Bài viết không có văn bản mô tả.</p>
          )}

          {/* Media Attachments Gallery */}
          {mediaList.length > 0 && (
            <div className="mt-3">
              <div
                className={`grid gap-2 rounded-xl overflow-hidden ${
                  mediaList.length === 1
                    ? 'grid-cols-1'
                    : mediaList.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {mediaList.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewMediaUrl(url)}
                    className="relative group aspect-video sm:aspect-square bg-slate-900 rounded-lg overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800"
                  >
                    <img
                      src={url}
                      alt={`Ảnh đính kèm ${idx + 1}`}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Xem ảnh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Post Metrics Footer */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-[#1c1e21]/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-rose-500">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              {targetDetail.likeCount ?? 0} Thích
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-sky-500">
              <MessageCircle className="w-3.5 h-3.5" />
              {targetDetail.commentCount ?? 0} Bình luận
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-indigo-500">
              <Share2 className="w-3.5 h-3.5" />
              {targetDetail.shareCount ?? 0} Chia sẻ
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Post ID: #{String(targetDetail.id || report.targetId).substring(0, 13)}...
          </span>
        </div>
      </div>
    )
  }

  const renderUserPreview = () => {
    if (isLoadingTarget) {
      return (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#242526] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-[#1877f2] animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Đang tải hồ sơ người dùng bị báo cáo...</p>
        </div>
      )
    }

    if (!targetDetail) {
      return (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold">Không tìm thấy thông tin tài khoản (ID: #{report.targetId})</p>
            <p className="text-[11px] mt-0.5 text-amber-600 dark:text-amber-300">
              Tài khoản có thể đã bị xóa hoặc không tồn tại trong hệ thống.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-2xl bg-white dark:bg-[#242526] border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
        {targetDetail.avatarUrl ? (
          <img
            src={targetDetail.avatarUrl}
            alt=""
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {(targetDetail.fullName || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="space-y-1">
          <h4 className="font-bold text-base text-slate-900 dark:text-white">{targetDetail.fullName}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">@{targetDetail.username || 'user'}</p>
          {targetDetail.bio && (
            <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">"{targetDetail.bio}"</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Xử Lý Báo Cáo Vi Phạm #${report.id}`}
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve(report.id, false, 'DISMISS')}
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4 mr-1.5 text-slate-400" />
              Bác Bỏ Báo Cáo (Không Phạt)
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => onResolve(report.id, deleteTarget, 'DELETE_AND_RESOLVE')}
                isLoading={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Chấp Nhận & Gỡ Nội Dung
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Report Complaint Summary Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Lý do vi phạm:
                </span>
                <Badge variant="danger" size="sm">
                  {report.reason}
                </Badge>
              </div>

              <span className="text-xs text-slate-400">
                Gửi lúc: {report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : 'Mới'}
              </span>
            </div>

            {/* Reporter info & Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Người gửi khiếu nại:</span>
                <div className="flex items-center gap-2">
                  {report.reporter?.avatarUrl ? (
                    <img src={report.reporter.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {report.reporter?.fullName || report.reporterId || 'Người dùng ẩn danh'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Ghi chú từ người báo cáo:</span>
                <p className="text-slate-800 dark:text-slate-200 italic truncate">
                  "{report.description || 'Không có ghi chú thêm.'}"
                </p>
              </div>
            </div>
          </div>

          {/* Reported Target Live Preview Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#1877f2]" />
                Xem xét nội dung mục tiêu ({report.targetType}):
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                ID: #{report.targetId}
              </span>
            </div>

            {report.targetType === 'POST' ? renderPostPreview() : renderUserPreview()}
          </div>

          {/* Action Checkbox */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#3a3b3c]/30 border border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={deleteTarget}
                onChange={(e) => setDeleteTarget(e.target.checked)}
                className="w-4 h-4 rounded text-[#1877f2] focus:ring-[#1877f2] border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span>Đồng thời gỡ bỏ và xóa vĩnh viễn nội dung mục tiêu này khỏi mạng xã hội</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Full Image Zoom Preview Modal */}
      {previewMediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewMediaUrl}
              alt="Full Preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ResolveReportModal
