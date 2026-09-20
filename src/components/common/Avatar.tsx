import React, { useState } from 'react'
import { User, Users } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'rounded' | 'circle'
  type?: 'user' | 'group'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  shape = 'rounded',
  type = 'user',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-16 h-16 text-lg',
  }[size]

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  const getInitials = (text: string) => {
    if (!text) return ''
    const parts = text.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initials = getInitials(name || alt)

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`${sizeClasses} ${shapeClasses} object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} ${shapeClasses} flex items-center justify-center font-bold bg-linear-to-tr from-indigo-600 to-violet-600 text-white shadow-xs shrink-0 ring-2 ring-indigo-500/20 select-none ${className}`}
      title={name || alt}
    >
      {initials ? (
        <span>{initials}</span>
      ) : type === 'group' ? (
        <Users className="w-1/2 h-1/2" />
      ) : (
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  )
}

export default Avatar
