import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  isDangerous = false,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={`p-3 rounded-2xl ${
            isDangerous
              ? 'bg-[#FEE2E2] text-[#FA383E] dark:bg-[#FA383E]/20'
              : 'bg-[#FEF3C7] text-[#B78103] dark:bg-[#F5C33B]/20 dark:text-[#F5C33B]'
          }`}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB]">
          {title}
        </h4>
        <p className="text-xs text-[#65676B] dark:text-[#B0B3B8]">{message}</p>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
