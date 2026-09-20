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
      <div className="min-h-screen bg-[#18191a] flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Đang xác thực quyền Admin...</span>
      </div>
    )
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

