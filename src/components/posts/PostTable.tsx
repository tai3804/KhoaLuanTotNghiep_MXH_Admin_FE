import React from 'react'
import { Eye, Trash2, Heart, MessageSquare, AlertTriangle } from 'lucide-react'
import { Post } from '../../types/post'
import DataTable, { Column } from '../common/DataTable'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Avatar from '../common/Avatar'

export interface PostTableProps {
  posts: Post[]
  isLoading?: boolean
  onPreview: (post: Post) => void
  onDeleteClick: (post: Post) => void
}

export const PostTable: React.FC<PostTableProps> = ({
  posts,
  isLoading,
  onPreview,
  onDeleteClick,
}) => {
  const columns: Column<Post>[] = [
    {
      header: 'Tác Giả',
      cell: (post) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author?.avatarUrl}
            name={post.author?.fullName || post.author?.username}
            size="md"
            shape="rounded"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {post.author?.fullName || 'Người dùng'}
            </p>
            <p className="text-xs text-slate-400">@{post.author?.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Nội Dung Bài Viết',
      cell: (post) => (
        <div className="max-w-md">
          <p className="text-slate-800 dark:text-slate-200 line-clamp-2 text-xs">
            {post.content}
          </p>
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <span className="inline-block mt-1 text-[11px] font-medium text-indigo-500">
              📷 {post.mediaUrls.length} file đính kèm
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Quyền Riêng Tư',
      cell: (post) => (
        <Badge variant="neutral" size="sm">
          {post.privacy}
        </Badge>
      ),
    },
    {
      header: 'Tương Tác',
      cell: (post) => (
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            {post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            {post.commentsCount}
          </span>
        </div>
      ),
    },
    {
      header: 'Trạng Thái',
      cell: (post) => {
        if (post.isFlagged || (post.reportsCount && post.reportsCount > 0)) {
          return (
            <Badge variant="danger" size="sm" dot>
              Bị tố cáo ({post.reportsCount ?? 1})
            </Badge>
          )
        }
        return (
          <Badge variant="success" size="sm" dot>
            Bình thường
          </Badge>
        )
      },
    },
    {
      header: 'Thời Gian',
      cell: (post) => (
        <span className="text-xs text-slate-400">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
        </span>
      ),
    },
    {
      header: 'Hành Động',
      className: 'text-right',
      cell: (post) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(post)}
            title="Xem chi tiết"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteClick(post)}
            title="Gỡ bài viết"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={posts} isLoading={isLoading} />
}

export default PostTable
