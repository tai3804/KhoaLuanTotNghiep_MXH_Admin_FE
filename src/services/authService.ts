import api from './api'
import { AdminUser, AuthResponse, LoginRequest } from '../types/auth'

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const payload = {
      email: credentials.identifier,
      password: credentials.password,
      deviceFingerprint: 'admin-web-dashboard',
      deviceName: 'Admin Web Dashboard',
    }

    const response = await api.post('/api/v1/auth/login', payload, {
      headers: {
        'X-Client-Type': 'WEB',
        'X-Device-Fingerprint': 'admin-web-dashboard',
      },
    })

    const resData = response.data
    // Unpack ApiResponse<LoginUserResponse> or direct payload
    if (resData && typeof resData === 'object') {
      if ('data' in resData && resData.data) {
        return resData.data
      }
      return resData
    }
    throw new Error('Dữ liệu phản hồi từ máy chủ không hợp lệ')
  },

  logout: async (): Promise<void> => {
    await api.post('/api/v1/auth/logout')
  },

  getCurrentUser: async (): Promise<AdminUser> => {
    const response = await api.get('/api/v1/auth/me')
    const resData = response.data
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data
    }
    return resData
  },

  refreshToken: async (): Promise<{ accessToken: string; user?: AdminUser }> => {
    const response = await api.post('/api/v1/auth/refresh')
    const resData = response.data
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data
    }
    return resData
  },
}
