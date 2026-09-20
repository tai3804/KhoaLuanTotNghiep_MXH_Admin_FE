export interface GroupOwner {
  id: string
  username: string
  fullName: string
  avatarUrl?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  avatarUrl?: string
  coverUrl?: string
  privacy: 'PUBLIC' | 'PRIVATE'
  owner: GroupOwner
  membersCount: number
  postsCount?: number
  isArchived?: boolean
  createdAt: string
  updatedAt?: string
}
