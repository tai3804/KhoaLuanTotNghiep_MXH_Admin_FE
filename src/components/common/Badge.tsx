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
    sm: 'px-2 py-0.5 text-[11px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size]

  const variantStyles = {
    success:
      'bg-[#e7f8ed] text-[#31a24c] dark:bg-[#31a24c]/20 dark:text-[#42b72a] border border-[#31a24c]/30',
    danger:
      'bg-[#ffebe8] text-[#fa383e] dark:bg-[#fa383e]/20 dark:text-[#ff5a5f] border border-[#fa383e]/30',
    warning:
      'bg-[#fff8e1] text-[#b78103] dark:bg-[#f5c33b]/20 dark:text-[#f5c33b] border border-[#f5c33b]/30',
    info:
      'bg-[#e5f6fd] text-[#0288d1] dark:bg-[#0288d1]/20 dark:text-[#29b6f6] border border-[#0288d1]/30',
    primary:
      'bg-[#e7f3ff] text-[#0866ff] dark:bg-[#0866ff]/20 dark:text-[#2d88ff] border border-[#0866ff]/30',
    neutral:
      'bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8] border border-[#ced0d4] dark:border-[#4e4f50]',
  }[variant]

  const dotColors = {
    success: 'bg-[#31a24c]',
    danger: 'bg-[#fa383e]',
    warning: 'bg-[#f5c33b]',
    info: 'bg-[#0288d1]',
    primary: 'bg-[#0866ff]',
    neutral: 'bg-[#8a8d91] dark:bg-[#b0b3b8]',
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
