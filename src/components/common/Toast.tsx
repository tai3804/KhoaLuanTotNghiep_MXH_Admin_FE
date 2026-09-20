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
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  }[type]

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-500/5',
    error: 'border-rose-500/30 bg-rose-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    info: 'border-sky-500/30 bg-sky-500/5',
  }[type]

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border ${borderColors} shadow-xl animate-in slide-in-from-right duration-200`}
    >
      {icons}
      <div className="flex-1">
        {title && (
          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h5>
        )}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default ToastContainer
