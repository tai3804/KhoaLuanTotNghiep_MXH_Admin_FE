import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size]

  const variantStyles = {
    success:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    danger:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    warning:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    info:
      'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    primary:
      'bg-[#1877f2]/10 text-[#1877f2] dark:text-[#2d88ff] border-[#1877f2]/20',
    neutral:
      'bg-slate-500/10 text-slate-600 dark:text-[#b0b3b8] border border-slate-500/20',
  }[variant]

  const dotColors = {
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    primary: 'bg-[#1877f2]',
    neutral: 'bg-slate-400 dark:bg-[#b0b3b8]',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  )
}

export default Badge
