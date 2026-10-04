import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  }[maxWidth]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full ${maxWidthClasses} bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E6EB] dark:border-[#393A3B]">
            <div>
              {title && (
                <h3 className="text-lg font-bold text-[#050505] dark:text-[#E4E6EB]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#65676B] hover:text-[#050505] dark:hover:text-[#E4E6EB] rounded-xl hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-[#050505] dark:text-[#E4E6EB]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F0F2F5]/60 dark:bg-[#18191A]/80 border-t border-[#E4E6EB] dark:border-[#393A3B]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
