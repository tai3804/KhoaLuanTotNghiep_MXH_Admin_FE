import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#050505] dark:text-[#e4e6eb]"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#65676b] dark:text-[#b0b3b8]">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full rounded-xl border bg-white dark:bg-[#3a3b3c]/50 text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] text-sm px-3.5 py-2.5 transition-all outline-none ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-[#fa383e] focus:ring-2 focus:ring-[#fa383e]/20'
              : 'border-[#e4e6eb] dark:border-[#393a3b] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 dark:focus:border-[#0866ff]'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-[#65676b] dark:text-[#b0b3b8]">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-[#fa383e] font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">{helperText}</p>
      )}
    </div>
  )
}

export default Input

