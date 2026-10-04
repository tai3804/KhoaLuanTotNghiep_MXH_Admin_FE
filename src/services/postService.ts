import api from './api'
import { Post } from '../types/post'
import { userService, userProfileCache } from './userService'

export const postService = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get('/api/v1/posts')
    const rawData = response.data
    const postsList: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    // Collect all unique author IDs and fetch their profiles in parallel
    const authorIds = Array.from(
      new Set(
        postsList
          .map((p) => String(p.authorId || p.userId || p.creatorId || p.author?.id || ''))
          .filter((id) => Boolean(id && id !== 'unknown'))
      )
    )

    if (authorIds.length > 0) {
      await Promise.allSettled(authorIds.map((id) => userService.fetchUserProfile(id)))
    }

    return postsList.map((p) => {
      const authorId = String(
        p.authorId || p.userId || p.creatorId || p.author?.id || p.author?.userId || ''
      )
      const cached = authorId ? userProfileCache[authorId] : null

      const author = {
        id: authorId || 'unknown',
        username: cached?.username || p.author?.username || p.authorUsername || p.username || 'user',
        fullName:
          cached?.fullName ||
          p.author?.fullName ||
          p.userFullName ||
          p.authorFullName ||
          p.authorName ||
          'Thành viên',
        avatarUrl: cached?.avatarUrl || p.author?.avatarUrl || p.userAvatar || p.authorAvatarUrl,
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
    try {
      await api.delete(`/api/v1/posts/${postId}`)
    } catch (err: any) {
      if (err?.response?.status === 403 || err?.response?.status === 404) {
        await api.delete(`/api/v1/posts/admin/${postId}`)
      } else {
        throw err
      }
    }
  },
}
