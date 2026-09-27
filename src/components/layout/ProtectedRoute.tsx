import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { setCredentials, logout, setLoading } from '../../store/slices/authSlice'
import { authService } from '../../services/authService'

export interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const location = useLocation()
  const [checkingAuth, setCheckingAuth] = useState<boolean>(!token)

  useEffect(() => {
    let isMounted = true

    const verifySession = async () => {
      if (token) {
        setCheckingAuth(false)
        dispatch(setLoading(false))
        return
      }

      try {
        const data = await authService.refreshToken()
        const newAccessToken = (data as any)?.accessToken || (data as any)?.token || (data as any)?.data?.accessToken
        const user = (data as any)?.user || (data as any)?.data?.user

        if (newAccessToken && isMounted) {
          dispatch(setCredentials({ token: newAccessToken, user }))
        } else if (isMounted) {
          dispatch(logout())
        }
      } catch {
        if (isMounted) {
          dispatch(logout())
        }
      } finally {
        if (isMounted) {
          setCheckingAuth(false)
          dispatch(setLoading(false))
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [token, dispatch])

  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 dark:bg-[#18191a] flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 gap-4 transition-colors">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#1877f2] to-violet-600 flex items-center justify-center text-white shadow-xl shadow-[#1877f2]/30 animate-pulse">
            <span className="font-black text-sm">KLTN</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-32 h-1.5 bg-slate-200 dark:bg-[#3a3b3c] rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#1877f2] animate-indeterminate" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-[#b0b3b8]">
            Đang xác thực quyền Admin...
          </span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

