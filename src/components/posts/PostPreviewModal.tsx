import React from 'react'
import { Post } from '../../types/post'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Badge from '../common/Badge'
import Avatar from '../common/Avatar'
import { Heart, MessageSquare, Share2, Calendar, Globe } from 'lucide-react'

export interface PostPreviewModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onDeleteClick?: (post: Post) => void
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  post,
  isOpen,
  onClose,
  onDeleteClick,
}) => {
  if (!post) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Bài Viết"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          {onDeleteClick ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onClose()
                onDeleteClick(post)
              }}
            >
              Gỡ bài viết này
            </Button>
          ) : (
            <div />
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Author Header */}
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author?.avatarUrl}
            name={post.author?.fullName || post.author?.username}
            size="lg"
            shape="rounded"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {post.author?.fullName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>@{post.author?.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.createdAt ? new Date(post.createdAt).toLocaleString('vi-VN') : 'Mới'}
              </span>
              <span>•</span>
              <Badge variant="neutral" size="sm">
                <Globe className="w-2.5 h-2.5 mr-1" />
                {post.privacy}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#3a3b3c]/40 border border-[#e4e6eb] dark:border-[#393a3b] text-sm text-slate-800 dark:text-[#e4e6eb] whitespace-pre-line leading-relaxed">
          {post.content}
        </div>

        {/* Media attachments */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.mediaUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Post media"
                className="w-full h-48 object-cover rounded-xl border border-[#e4e6eb] dark:border-[#393a3b]"
              />
            ))}
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex items-center gap-6 py-3 border-y border-[#e4e6eb] dark:border-[#393a3b] text-xs font-semibold text-slate-500 dark:text-[#b0b3b8]">
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            {post.likesCount} Lượt thích
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#1877f2]" />
            {post.commentsCount} Bình luận
          </span>
          <span className="flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-emerald-500" />
            {post.sharesCount} Chia sẻ
          </span>
        </div>
      </div>
    </Modal>
  )
}

export default PostPreviewModal
