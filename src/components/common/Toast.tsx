import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { removeToast } from '../../store/slices/toastSlice'

export const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((state) => state.toast.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onClose: () => void
}

const ToastItem: React.FC<ToastItemProps> = ({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#31A24C] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#FA383E] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F5C33B] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#0866FF] shrink-0" />,
  }[type]

  const borderColors = {
    success: 'border-[#31A24C]/30 bg-white dark:bg-[#242526]',
    error: 'border-[#FA383E]/30 bg-white dark:bg-[#242526]',
    warning: 'border-[#F5C33B]/30 bg-white dark:bg-[#242526]',
    info: 'border-[#0866FF]/30 bg-white dark:bg-[#242526]',
  }[type]

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${borderColors} shadow-xl animate-in slide-in-from-right duration-200`}
    >
      {icons}
      <div className="flex-1">
        {title && (
          <h5 className="text-xs font-bold text-[#050505] dark:text-[#E4E6EB]">
            {title}
          </h5>
        )}
        <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-[#65676B] hover:text-[#050505] dark:hover:text-[#E4E6EB] rounded-lg transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default ToastContainer
