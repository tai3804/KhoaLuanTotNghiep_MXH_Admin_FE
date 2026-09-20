import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

interface ToastState {
  toasts: ToastItem[]
}

const initialState: ToastState = {
  toasts: [],
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastItem, 'id'> & { id?: string }>) => {
      const id = action.payload.id || Math.random().toString(36).substring(2, 9)
      state.toasts.push({ ...action.payload, id })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearAllToasts: (state) => {
      state.toasts = []
    },
  },
})

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions

export default toastSlice.reducer
