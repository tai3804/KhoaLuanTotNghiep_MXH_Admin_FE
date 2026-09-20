import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }[size]

  const variantStyles = {
    primary:
      'bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-xs shadow-[#1877f2]/30 hover:shadow-md hover:shadow-[#1877f2]/40',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] dark:text-[#e4e6eb]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-500/30 hover:shadow-md hover:shadow-rose-500/40',
    warning:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-xs shadow-amber-500/30',
    outline:
      'border border-[#e4e6eb] dark:border-[#393a3b] text-slate-700 dark:text-[#e4e6eb] hover:bg-slate-50 dark:hover:bg-[#3a3b3c]/60',
    ghost:
      'text-slate-600 dark:text-[#b0b3b8] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]/60 hover:text-slate-900 dark:hover:text-[#e4e6eb]',
  }[variant]

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}

export default Button
