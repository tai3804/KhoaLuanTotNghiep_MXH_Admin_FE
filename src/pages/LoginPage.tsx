import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store'
import { setCredentials, setLoading, setError } from '../store/slices/authSlice'
import { authService } from '../services/authService'
import { addToast } from '../store/slices/toastSlice'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const from = location.state?.from?.pathname || '/'

  React.useEffect(() => {
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
      const user = res.user || res.data?.user || {
        id: 'usr_admin',
        username: identifier,
        email: identifier.includes('@') ? identifier : `${identifier}@kltn.edu.vn`,
        fullName: 'Quản Trị Viên',
        role: 'ADMIN',
      }

      if (!token) {
        throw new Error('Không nhận được Access Token từ máy chủ')
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
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            KLTN Social Admin
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cổng quản trị Mạng Xã Hội Khoá Luận Tốt Nghiệp
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mb-6">
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
      </div>
    </div>
  )
}

export default LoginPage
