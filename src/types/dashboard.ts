export interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalReports: number
  pendingReports: number
  newUsersToday?: number
  newPostsToday?: number
  resolvedReportsToday?: number
  activeUsersNow?: number
}

export interface UserGrowthStat {
  date: string
  newUsers: number
  activeUsers: number
}

export interface InteractionStat {
  date: string
  posts: number
  comments: number
  likes: number
}

export interface ReportCategoryStat {
  category: string
  count: number
  percentage: number
}
