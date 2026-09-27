import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import userReducer from './slices/userSlice'
import reportReducer from './slices/reportSlice'
import postReducer from './slices/postSlice'
import groupReducer from './slices/groupSlice'
import settingsReducer from './slices/settingsSlice'
import toastReducer from './slices/toastSlice'
import themeReducer from './slices/themeSlice'
import analyticsReducer from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    report: reportReducer,
    post: postReducer,
    group: groupReducer,
    settings: settingsReducer,
    toast: toastReducer,
    theme: themeReducer,
    analytics: analyticsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
