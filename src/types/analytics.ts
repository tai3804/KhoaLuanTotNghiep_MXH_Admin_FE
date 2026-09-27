export interface ActivityHeatmapData {
  days: string[]
  hours: number[]
  matrix: number[][]
  peakTimeRange: string
  peakDay: string
  eveningActivityRatio: number
  totalWeeklyInteractions: number
}

export interface TrendingHashtag {
  rank: number
  tag: string
  category: string
  postCount: number
  growthPercentage: number
  engagementScore: number
  status: 'SAFE' | 'VIRAL' | 'REVIEW' | string
}

export interface DemographicsData {
  deviceDistribution: Record<string, number>
  browserDistribution: Record<string, number>
  ageGroupDistribution: Record<string, number>
  averageRetentionRate: number
  dailyActiveRatio: number
}

export type TimeRange = '24h' | '7d' | '30d' | 'quarter'
