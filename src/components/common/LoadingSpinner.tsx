import React from 'react'
import { Loader2 } from 'lucide-react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size]

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses} animate-spin text-[#0866ff] dark:text-[#2d88ff]`} />
      {text && (
        <p className="text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8]">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f2f5]/80 dark:bg-[#18191a]/80 backdrop-blur-xs">
        {content}
      </div>
    )
  }

  return <div className="p-8 flex items-center justify-center">{content}</div>
}

export default LoadingSpinner

