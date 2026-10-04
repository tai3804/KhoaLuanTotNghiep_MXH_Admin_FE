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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }[size]

  const variantStyles = {
    primary:
      'bg-[#0866ff] hover:bg-[#0055d6] text-white shadow-xs hover:shadow-md',
    secondary:
      'bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] dark:text-[#e4e6eb]',
    danger:
      'bg-[#fa383e] hover:bg-[#e41e3f] text-white shadow-xs hover:shadow-md',
    warning:
      'bg-[#f5c33b] hover:bg-[#e0b028] text-slate-900 shadow-xs',
    outline:
      'border border-[#ced0d4] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]',
    ghost:
      'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] hover:text-[#050505] dark:hover:text-[#e4e6eb]',
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
