export interface PostMedia {
  id: string
  url: string
  type: 'IMAGE' | 'VIDEO'
  thumbnailUrl?: string
}

export interface PostAuthor {
  id: string
  username: string
  fullName: string
  avatarUrl?: string
}

export interface Post {
  id: string
  author: PostAuthor
  content: string
  media?: PostMedia[]
  mediaUrls?: string[]
  privacy: 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
  likesCount: number
  commentsCount: number
  sharesCount: number
  reportsCount?: number
  isFlagged?: boolean
  status?: 'ACTIVE' | 'HIDDEN' | 'DELETED'
  createdAt: string
  updatedAt?: string
}

export interface Comment {
  id: string
  postId: string
  author: PostAuthor
  content: string
  createdAt: string
  likesCount: number
}

export interface PostFilter {
  searchQuery: string
  privacy?: string
  status?: string
  page: number
  limit: number
}
