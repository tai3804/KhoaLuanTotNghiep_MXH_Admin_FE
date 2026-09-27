import React from 'react'

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showText?: boolean
  onClick?: () => void
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = false,
  onClick,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  const emblemClass = sizeMap[size] || sizeMap.md

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Social Orb Emblem matching User FE */}
      <div
        className={`relative flex items-center justify-center ${emblemClass} rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/25 shrink-0 transition-transform duration-300 hover:scale-105`}
      >
        <div className="w-full h-full bg-slate-950/40 rounded-[14px] backdrop-blur-md flex items-center justify-center p-1.5 relative overflow-hidden">
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400/40 rounded-full blur-xs" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-pink-500/40 rounded-full blur-xs" />

          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10 filter drop-shadow-xs"
          >
            <defs>
              <linearGradient id="orbGradPrimaryAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <linearGradient id="orbGradRingAdmin" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F472B6" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glowAdmin" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <circle cx="50" cy="50" r="16" fill="url(#orbGradPrimaryAdmin)" filter="url(#glowAdmin)" />
            <circle cx="45" cy="45" r="5" fill="#FFFFFF" opacity="0.6" />

            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="14"
              fill="none"
              stroke="url(#orbGradRingAdmin)"
              strokeWidth="5"
              transform="rotate(-28 50 50)"
              strokeLinecap="round"
            />

            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="14"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeOpacity="0.4"
              strokeDasharray="6 4"
              transform="rotate(35 50 50)"
            />

            <circle cx="20" cy="38" r="5" fill="#38BDF8" />
            <circle cx="80" cy="62" r="5" fill="#F472B6" />
            <circle cx="68" cy="28" r="4" fill="#FDE047" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            KLTN SOCIAL
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-[#b0b3b8] -mt-1 tracking-widest uppercase">
            Admin Portal
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
