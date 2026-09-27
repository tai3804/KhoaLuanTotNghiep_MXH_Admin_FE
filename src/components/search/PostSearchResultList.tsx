import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Heart,
  MessageSquare,
  Share2,
  Image,
  Globe,
  Lock,
  Users,
  Eye,
  AlertTriangle,
  Calendar,
} from 'lucide-react'
import { Post } from '../../types/post'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Pagination from '../common/Pagination'

interface PostSearchResultListProps {
  posts: Post[]
}

export const PostSearchResultList: React.FC<PostSearchResultListProps> = ({ posts }) => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [posts.length])

  const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getPrivacyBadge = (privacy: string) => {
    switch (privacy) {
      case 'PUBLIC':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <Globe className="w-3 h-3" /> Công khai
          </span>
        )
      case 'FRIENDS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">
            <Users className="w-3 h-3" /> Bạn bè
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#3a3b3c] px-2 py-0.5 rounded-md">
            <Lock className="w-3 h-3" /> Riêng tư
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedPosts.map((post) => {
          const mediaCount = (post.media?.length || 0) + (post.mediaUrls?.length || 0)
          return (
            <div
              key={post.id}
              className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-slate-200 dark:border-[#393a3b] shadow-xs hover:border-[#1877f2]/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Author & Privacy */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      src={post.author?.avatarUrl}
                      name={post.author?.fullName || post.author?.username}
                      size="sm"
                      shape="rounded"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-[#e4e6eb] truncate">
                        {post.author?.fullName || 'Người dùng'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-[#b0b3b8]">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleString('vi-VN')
                            : 'Mới đây'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getPrivacyBadge(post.privacy)}
                    {post.isFlagged && (
                      <Badge variant="danger" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Bị tố cáo
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content snippet */}
                <div className="bg-slate-50 dark:bg-[#1c1e21] p-3 rounded-xl border border-slate-100 dark:border-[#393a3b]/40 mb-3">
                  <p className="text-xs text-slate-800 dark:text-[#e4e6eb] leading-relaxed line-clamp-3">
                    {post.content || <span className="italic text-slate-400">Không có văn bản</span>}
                  </p>

                  {mediaCount > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#1877f2] font-semibold">
                      <Image className="w-3.5 h-3.5" />
                      <span>{mediaCount} tệp đa phương tiện đính kèm</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement Stats & Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#393a3b]/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#b0b3b8]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {post.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                    {post.commentsCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                    {post.sharesCount || 0}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/posts')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1877f2] dark:text-[#2d88ff] hover:bg-[#1877f2]/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem bài viết</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Footer */}
      {posts.length > 0 && (
        <div className="p-4 bg-white dark:bg-[#242526] rounded-2xl border border-slate-200 dark:border-[#393a3b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#b0b3b8]">
            <span>Hiển thị mỗi trang:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-slate-50 dark:bg-[#18191a] text-slate-800 dark:text-[#e4e6eb] text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-[#393a3b] cursor-pointer"
            >
              <option value={4}>4 bài</option>
              <option value={8}>8 bài</option>
              <option value={16}>16 bài</option>
              <option value={32}>32 bài</option>
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={posts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

export default PostSearchResultList
