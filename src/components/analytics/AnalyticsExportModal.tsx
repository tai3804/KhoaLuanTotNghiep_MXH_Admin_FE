import React, { useState } from 'react'
import {
  Printer,
  FileSpreadsheet,
  CheckCheck,
} from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import {
  ActivityHeatmapData,
  TrendingHashtag,
  DemographicsData,
  TimeRange,
} from '../../types/analytics'
import { DashboardStats } from '../../types/dashboard'

interface AnalyticsExportModalProps {
  isOpen: boolean
  onClose: () => void
  timeRange: TimeRange
  heatmap: ActivityHeatmapData | null
  trends: TrendingHashtag[]
  demographics: DemographicsData | null
  stats: DashboardStats | null
}

export const AnalyticsExportModal: React.FC<AnalyticsExportModalProps> = ({
  isOpen,
  onClose,
  timeRange,
  heatmap,
  trends,
  demographics,
  stats,
}) => {
  const [downloaded, setDownloaded] = useState(false)

  const handleExportCSV = () => {
    const rows = [
      ['BÁO CÁO PHÂN TÍCH XU HƯỚNG & HOẠT ĐỘNG MẠNG XÃ HỘI'],
      ['Thời gian xuất:', new Date().toLocaleString('vi-VN')],
      ['Khung thời gian:', timeRange === '24h' ? '24 Giờ qua' : timeRange === '7d' ? '7 Ngày gần nhất' : timeRange === '30d' ? '30 Ngày qua' : 'Quý hiện tại'],
      [''],
      ['I. CHỈ SỐ TỔNG QUAN'],
      ['Tổng người dùng:', stats?.totalUsers ?? 0],
      ['Tổng bài viết:', stats?.totalPosts ?? 0],
      ['Tổng lượt tương tác tuần:', heatmap?.totalWeeklyInteractions ?? 0],
      ['Khung giờ vàng tương tác:', heatmap?.peakTimeRange || 'Chưa xác định'],
      ['Ngày cao điểm nhất:', heatmap?.peakDay || 'Chưa xác định'],
      ['Tỷ lệ giữ chân người dùng:', demographics?.averageRetentionRate != null && demographics.averageRetentionRate > 0 ? `${demographics.averageRetentionRate}%` : 'Chưa có dữ liệu'],
      [''],
      ['II. TOP HASHTAG & XU HƯỚNG BÙNG NỔ'],
      ['Hạng', 'Hashtag', 'Chuyên mục', 'Số bài viết', 'Tăng trưởng (%)', 'Điểm tương tác', 'Trạng thái'],
      ...trends.map((t) => [
        t.rank,
        t.tag,
        t.category,
        t.postCount,
        `+${t.growthPercentage}%`,
        t.engagementScore,
        t.status,
      ]),
      [''],
      ['III. PHÂN BỔ THIẾT BỊ TRUY CẬP'],
      ...(demographics
        ? Object.entries(demographics.deviceDistribution).map(([dev, pct]) => [
            dev,
            `${pct}%`,
          ])
        : []),
    ]

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      rows.map((e) => e.join(',')).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `BaoCao_XuHuong_MXH_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xuất Báo Cáo Phân Tích & Xu Hướng"
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintPDF}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            In / Lưu PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={
              downloaded ? (
                <CheckCheck className="w-4 h-4 text-emerald-300" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )
            }
          >
            {downloaded ? 'Đã tải xuống CSV' : 'Tải File CSV'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Document Header */}
        <div className="p-4 rounded-2xl bg-[#F0F2F5] dark:bg-[#18191A] border border-[#E4E6EB] dark:border-[#393A3B] space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-[#050505] dark:text-[#E4E6EB] uppercase tracking-wider">
              Báo Cáo Tổng Hợp Xu Hướng & Tương Tác
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-[#E7F3FF] dark:bg-[#0866FF]/20 text-[#0866FF] font-bold text-[11px]">
              {timeRange === '24h'
                ? '24 Giờ qua'
                : timeRange === '7d'
                ? '7 Ngày gần nhất'
                : timeRange === '30d'
                ? '30 Ngày qua'
                : 'Quý này'}
            </span>
          </div>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">
            Ngày lập báo cáo: {new Date().toLocaleDateString('vi-VN')} • Hệ thống Quản trị Mạng Xã Hội
          </p>
        </div>

        {/* Quick Preview Table */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] uppercase tracking-wider">
            Tóm Tắt Chỉ Số Chủ Đạo
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 border border-[#E4E6EB] dark:border-[#393A3B]">
              <span className="text-[#65676B] dark:text-[#B0B3B8] block text-[10px]">Tương tác tuần</span>
              <span className="font-bold text-[#050505] dark:text-[#E4E6EB]">
                {(heatmap?.totalWeeklyInteractions ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 border border-[#E4E6EB] dark:border-[#393A3B]">
              <span className="text-[#65676B] dark:text-[#B0B3B8] block text-[10px]">Giờ cao điểm</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {heatmap?.peakTimeRange || '--:--'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 border border-[#E4E6EB] dark:border-[#393A3B]">
              <span className="text-[#65676B] dark:text-[#B0B3B8] block text-[10px]">Top 1 Hashtag</span>
              <span className="font-bold text-[#B78103] dark:text-[#F5C33B] truncate block">
                {trends[0]?.tag || 'Chưa có'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C]/50 border border-[#E4E6EB] dark:border-[#393A3B]">
              <span className="text-[#65676B] dark:text-[#B0B3B8] block text-[10px]">Tỷ lệ giữ chân</span>
              <span className="font-bold text-[#31A24C]">
                {demographics?.averageRetentionRate != null && demographics.averageRetentionRate > 0
                  ? `${demographics.averageRetentionRate}%`
                  : '--%'}
              </span>
            </div>
          </div>
        </div>

        {/* Top 5 Trends in Preview */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB] uppercase tracking-wider">
            Top Hashtag Xu Hướng Bàn Luận
          </h5>
          <div className="border border-[#E4E6EB] dark:border-[#393A3B] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F0F2F5] dark:bg-[#18191A] text-[10px] text-[#65676B] dark:text-[#B0B3B8] uppercase font-bold border-b border-[#E4E6EB] dark:border-[#393A3B]">
                <tr>
                  <th className="px-3 py-2">Hạng</th>
                  <th className="px-3 py-2">Hashtag</th>
                  <th className="px-3 py-2">Chuyên mục</th>
                  <th className="px-3 py-2 text-right">Bài viết</th>
                  <th className="px-3 py-2 text-right">Tăng trưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E6EB] dark:divide-[#393A3B]">
                {trends.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-[#65676B] dark:text-[#B0B3B8]">
                      Chưa có hashtag thịnh hành
                    </td>
                  </tr>
                ) : (
                  trends.slice(0, 5).map((t) => (
                    <tr key={t.tag} className="hover:bg-[#F0F2F5]/80 dark:hover:bg-[#3A3B3C]/40">
                      <td className="px-3 py-2 font-bold text-center w-10 text-[#050505] dark:text-[#E4E6EB]">#{t.rank}</td>
                      <td className="px-3 py-2 font-semibold text-[#0866FF]">
                        {t.tag}
                      </td>
                      <td className="px-3 py-2 text-[#65676B] dark:text-[#B0B3B8]">{t.category}</td>
                      <td className="px-3 py-2 text-right font-bold text-[#050505] dark:text-[#E4E6EB]">{t.postCount}</td>
                      <td className="px-3 py-2 text-right font-bold text-[#31A24C]">
                        +{t.growthPercentage}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-[#65676B] dark:text-[#B0B3B8] italic">
          💡 Bạn có thể in trực tiếp thành file PDF chuẩn khổ A4 hoặc tải file CSV để phân tích nâng cao trên Excel / Google Sheets.
        </p>
      </div>
    </Modal>
  )
}

export default AnalyticsExportModal

