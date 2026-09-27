import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  ...props
}) => {
  const variantStyles = {
    text: 'h-3.5 w-full rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }[variant]

  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-[#3a3b3c]/60 ${variantStyles} ${className}`}
      {...props}
    />
  )
}

/**
 * Skeleton loader for data tables (Users, Reports, Posts, AuditLogs)
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 6,
  columns = 5,
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#242526] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] p-5 space-y-4 shadow-sm animate-pulse">
      {/* Table Toolbar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-3">
          <Skeleton className="w-48 h-9 rounded-xl" />
          <Skeleton className="w-32 h-9 rounded-xl hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-9 rounded-xl" />
          <Skeleton className="w-28 h-9 rounded-xl" />
        </div>
      </div>

      {/* Table Header Skeleton */}
      <div className="grid grid-cols-12 gap-4 py-2 border-b border-slate-100 dark:border-[#393a3b]/60 px-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${
              i === 0 ? 'col-span-3' : i === columns - 1 ? 'col-span-2' : 'col-span-2'
            }`}
          />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      <div className="space-y-3.5 pt-1">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-12 gap-4 items-center py-2.5 px-2 border-b border-slate-50 dark:border-[#393a3b]/30 last:border-0"
          >
            <div className="col-span-3 flex items-center gap-3">
              <Skeleton variant="circular" className="w-9 h-9" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </div>
            <div className="col-span-2">
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="col-span-3">
              <Skeleton className="h-3.5 w-32" />
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton loader for the main Dashboard
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="w-full h-32 rounded-3xl bg-linear-to-r from-slate-200 to-slate-100 dark:from-[#2a2b2c] dark:to-[#242526] p-6 flex flex-col justify-center space-y-3 border border-[#e4e6eb] dark:border-[#393a3b]">
        <Skeleton className="w-64 h-6" />
        <Skeleton className="w-96 h-4" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton variant="circular" className="w-10 h-10" />
            </div>
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-20 h-3" />
          </div>
        ))}
      </div>

      {/* 2 Big Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-24 h-8 rounded-xl" />
          </div>
          <Skeleton className="w-full h-72 rounded-xl" />
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] space-y-4 shadow-sm">
          <Skeleton className="w-36 h-5" />
          <Skeleton className="w-full h-72 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/**
 * Full page fallback skeleton for Lazy Loading Suspense
 */
export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between pb-4 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="space-y-2">
          <Skeleton className="w-56 h-7" />
          <Skeleton className="w-80 h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-28 h-10 rounded-xl" />
          <Skeleton className="w-32 h-10 rounded-xl" />
        </div>
      </div>
      <TableSkeleton rows={7} columns={5} />
    </div>
  )
}

export default Skeleton
