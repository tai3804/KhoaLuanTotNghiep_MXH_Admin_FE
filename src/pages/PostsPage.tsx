import React, { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setPosts,
  setSelectedPost,
  setFilter,
  deletePostSuccess,
  setLoading,
  setActionLoading,
} from '../store/slices/postSlice'
import { addToast } from '../store/slices/toastSlice'
import { postService } from '../services/postService'
import { Post } from '../types/post'
import PostFilterBar from '../components/posts/PostFilterBar'
import PostTable from '../components/posts/PostTable'
import PostPreviewModal from '../components/posts/PostPreviewModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination from '../components/common/Pagination'

export const PostsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { posts, selectedPost, filter, isLoading, actionLoading } =
    useAppSelector((state) => state.post)

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      if (posts.length === 0) {
        dispatch(setLoading(true))
      }
      try {
        const data = await postService.getAllPosts()
        dispatch(setPosts({ posts: data }))
      } catch (e) {
        console.error('Failed to load posts:', e)
        if (posts.length === 0) {
          dispatch(setPosts({ posts: [] }))
        }
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchPosts()
  }, [dispatch, posts.length])

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        filter.searchQuery === '' ||
        p.content.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        p.author?.fullName?.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        p.author?.username?.toLowerCase().includes(filter.searchQuery.toLowerCase())

      const matchesPrivacy =
        !filter.privacy ||
        filter.privacy === 'ALL' ||
        p.privacy === filter.privacy

      return matchesSearch && matchesPrivacy
    })
  }, [posts, filter])

  const paginatedPosts = useMemo(() => {
    const start = (filter.page - 1) * filter.limit
    return filteredPosts.slice(start, start + filter.limit)
  }, [filteredPosts, filter.page, filter.limit])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    dispatch(setActionLoading(true))
    try {
      await postService.deletePost(deleteTarget.id)
      dispatch(deletePostSuccess(deleteTarget.id))
      dispatch(
        addToast({
          type: 'success',
          title: 'Đã gỡ bài viết',
          message: 'Bài viết vi phạm đã được xóa khỏi hệ thống.',
        })
      )
      setDeleteTarget(null)
    } catch {
      dispatch(
        addToast({
          type: 'error',
          title: 'Thất bại',
          message: 'Không thể xóa bài viết này.',
        })
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Quản Lý Bài Viết & Nội Dung
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Giám sát dòng bảng tin, xem trước nội dung/media và gỡ bỏ bài viết vi phạm chính sách
        </p>
      </div>

      <PostFilterBar
        filter={filter}
        onChange={(newFilter) => dispatch(setFilter(newFilter))}
      />

      <PostTable
        posts={paginatedPosts}
        isLoading={isLoading}
        onPreview={(post) => {
          dispatch(setSelectedPost(post))
          setIsPreviewOpen(true)
        }}
        onDeleteClick={(post) => setDeleteTarget(post)}
      />

      <Pagination
        currentPage={filter.page}
        totalItems={filteredPosts.length}
        pageSize={filter.limit}
        onPageChange={(page) => dispatch(setFilter({ page }))}
      />

      <PostPreviewModal
        post={selectedPost}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDeleteClick={(post) => setDeleteTarget(post)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Gỡ Bỏ Bài Viết"
        message="Hành động này sẽ xóa vĩnh viễn bài viết cùng toàn bộ bình luận và hình ảnh đính kèm khỏi cơ sở dữ liệu."
        confirmText="Xác Nhận Xóa"
        isDangerous
        isLoading={actionLoading}
      />
    </div>
  )
}

export default PostsPage
