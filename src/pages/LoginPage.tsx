import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials, setLoading, setError, extractUserFromToken } from '../store/slices/authSlice'
import { toggleTheme } from '../store/slices/themeSlice'
import { authService } from '../services/authService'
import { addToast } from '../store/slices/toastSlice'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Logo from '../components/common/Logo'

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const isDark = useAppSelector((state) => state.theme.isDark)

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    dispatch(setLoading(false))
    dispatch(setError(null))
  }, [dispatch])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      dispatch(setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu'))
      return
    }

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      // Direct call to Auth Service via API Gateway :8080
      const res = await authService.login({
        identifier: identifier.trim(),
        password,
      })

      const token = res.accessToken || res.data?.accessToken
      if (!token) {
        throw new Error('Không nhận được Access Token từ máy chủ')
      }

      let parsedPayload: any = null
      try {
        const payloadStr = token.split('.')[1]
        if (payloadStr) {
          parsedPayload = JSON.parse(atob(payloadStr.replace(/-/g, '+').replace(/_/g, '/')))
        }
      } catch (e) {
        // ignore
      }

      const decodedUser = extractUserFromToken(token)
      const user = res.user || res.data?.user || decodedUser || {
        id: parsedPayload?.sub || 'admin',
        username: parsedPayload?.email?.split('@')[0] || identifier,
        email: parsedPayload?.email || (identifier.includes('@') ? identifier : ''),
        fullName: decodedUser?.fullName || identifier,
        avatarUrl: decodedUser?.avatarUrl,
        role: parsedPayload?.roles?.[0] || 'ADMIN',
      }

      // Save to pure Redux in-memory state
      dispatch(setCredentials({ token, user }))
      dispatch(
        addToast({
          type: 'success',
          title: 'Đăng nhập thành công',
          message: `Chào mừng ${user.fullName} đến với trang quản trị.`,
        })
      )
      navigate(from, { replace: true })
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.'
      dispatch(setError(errorMsg))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-[#F0F2F5] dark:bg-[#18191A] text-[#050505] dark:text-[#E4E6EB] relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0866FF]/10 dark:bg-[#0866FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2D88FF]/10 dark:bg-[#2D88FF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top right Theme Toggle Switch */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-[#242526]/80 backdrop-blur-md border border-[#E4E6EB] dark:border-[#393A3B] text-[#65676B] dark:text-[#E4E6EB] hover:bg-[#F0F2F5] dark:hover:bg-[#3A3B3C] hover:text-[#0866FF] dark:hover:text-[#2D88FF] shadow-xs transition-all"
          title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#F5C33B]" />
          ) : (
            <Moon className="w-4 h-4 text-[#65676B]" />
          )}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/40 transition-colors duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-[#050505] dark:text-[#E4E6EB] tracking-tight">
            KLTN Social Admin
          </h2>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-1 font-medium">
            Cổng quản trị Mạng Xã Hội Khoá Luận Tốt Nghiệp
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FEE2E2] dark:bg-[#FA383E]/20 border border-[#FA383E]/30 text-[#FA383E] text-xs mb-6 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Tài khoản / Email Quản trị"
            type="text"
            placeholder="Nhập email hoặc username..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            leftIcon={<ShieldCheck className="w-5 h-5" />}
          >
            Đăng Nhập Quản Trị
          </Button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-[#E4E6EB] dark:border-[#393A3B]">
          <p className="text-[11px] font-bold text-[#65676B] dark:text-[#B0B3B8] text-center mb-2.5 uppercase tracking-wider">
            Đăng nhập nhanh tài khoản mẫu
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIdentifier('admin')
                setPassword('admin123')
              }}
              className="p-3 rounded-2xl bg-[#F0F2F5] hover:bg-[#E4E6EB] dark:bg-[#3A3B3C]/40 dark:hover:bg-[#3A3B3C] border border-[#E4E6EB] hover:border-[#0866FF]/50 dark:border-[#393A3B] dark:hover:border-[#0866FF]/50 text-xs font-medium text-[#050505] dark:text-[#E4E6EB] flex flex-col items-center gap-1 transition-all cursor-pointer group"
            >
              <span className="font-bold text-[#0866FF] dark:text-[#2D88FF]">
                Quản Trị Viên
              </span>
              <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] font-mono">admin / admin123</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifier('moderator')
                setPassword('mod123')
              }}
              className="p-3 rounded-2xl bg-[#F0F2F5] hover:bg-[#E4E6EB] dark:bg-[#3A3B3C]/40 dark:hover:bg-[#3A3B3C] border border-[#E4E6EB] hover:border-[#F5C33B]/50 dark:border-[#393A3B] dark:hover:border-[#F5C33B]/50 text-xs font-medium text-[#050505] dark:text-[#E4E6EB] flex flex-col items-center gap-1 transition-all cursor-pointer group"
            >
              <span className="font-bold text-[#B78103] dark:text-[#F5C33B]">
                Kiểm Duyệt
              </span>
              <span className="text-[10px] text-[#65676B] dark:text-[#B0B3B8] font-mono">moderator / mod123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
