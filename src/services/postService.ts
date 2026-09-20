import api from './api'
import { Post } from '../types/post'

export const postService = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get('/api/v1/posts')
    const rawData = response.data
    const postsList: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return postsList.map((p) => {
      const author = p.author || {
        id: p.userId || p.authorId || 'unknown',
        username: p.username || p.authorUsername || 'user',
        fullName: p.userFullName || p.authorFullName || p.authorName || 'Thành viên',
        avatarUrl: p.userAvatar || p.authorAvatarUrl,
      }

      const mediaUrls =
        p.mediaUrls ||
        (Array.isArray(p.media) ? p.media.map((m: any) => m.url || m) : [])

      return {
        id: String(p.id || p.postId),
        author,
        content: p.content || '',
        mediaUrls,
        privacy: p.privacy || 'PUBLIC',
        likesCount: p.likesCount ?? p.likeCount ?? 0,
        commentsCount: p.commentsCount ?? p.commentCount ?? 0,
        sharesCount: p.sharesCount ?? p.shareCount ?? 0,
        reportsCount: p.reportsCount ?? 0,
        isFlagged: p.isFlagged ?? false,
        status: p.status || 'ACTIVE',
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt,
      } as Post
    })
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/api/v1/posts/${postId}`)
  },
}
