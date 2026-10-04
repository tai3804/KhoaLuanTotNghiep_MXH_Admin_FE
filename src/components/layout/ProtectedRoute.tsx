import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector, store } from '../../store'
import { setCredentials, logout, setLoading, parseTokenPayload } from '../../store/slices/authSlice'
import { authService } from '../../services/authService'
import Logo from '../common/Logo'

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

  // Proactive background silent refresh timer: renew access token before it expires without reload
  useEffect(() => {
    if (!token) return

    const payload = parseTokenPayload(token)
    if (!payload || !payload.exp) return

    const expiresAtMs = payload.exp * 1000
    const now = Date.now()
    const timeRemaining = expiresAtMs - now

    // Refresh 2 minutes before expiry, or at 75% of remaining lifetime
    const bufferMs = Math.min(120000, Math.max(10000, timeRemaining * 0.25))
    const delayMs = Math.max(timeRemaining - bufferMs, 5000)

    const timer = setTimeout(async () => {
      try {
        const data = await authService.refreshToken()
        const newAccessToken = (data as any)?.accessToken || (data as any)?.token || (data as any)?.data?.accessToken
        const user = (data as any)?.user || (data as any)?.data?.user
        if (newAccessToken) {
          dispatch(setCredentials({ token: newAccessToken, user }))
        }
      } catch (err) {
        console.warn('[Admin] Proactive background token refresh notice:', err)
      }
    }, delayMs)

    return () => clearTimeout(timer)
  }, [token, dispatch])

  // Check token freshness on tab focus or wake from sleep
  useEffect(() => {
    const checkFreshness = async () => {
      const currentToken = store.getState().auth.token
      if (!currentToken) return

      const payload = parseTokenPayload(currentToken)
      if (!payload || !payload.exp) return

      const timeRemaining = payload.exp * 1000 - Date.now()
      if (timeRemaining < 60000) {
        try {
          const data = await authService.refreshToken()
          const newAccessToken = (data as any)?.accessToken || (data as any)?.token || (data as any)?.data?.accessToken
          const user = (data as any)?.user || (data as any)?.data?.user
          if (newAccessToken) {
            dispatch(setCredentials({ token: newAccessToken, user }))
          }
        } catch (err) {
          console.warn('[Admin] Focus token renewal notice:', err)
        }
      }
    }

    window.addEventListener('focus', checkFreshness)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkFreshness()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('focus', checkFreshness)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [dispatch])

  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#F0F2F5] dark:bg-[#18191A] flex flex-col items-center justify-center text-[#050505] dark:text-[#E4E6EB] gap-4 transition-colors">
        <div className="relative flex items-center justify-center">
          <Logo size="lg" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-32 h-1.5 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#0866FF] animate-indeterminate" />
          </div>
          <span className="text-[11px] font-semibold text-[#65676B] dark:text-[#B0B3B8]">
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

