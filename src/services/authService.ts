import api from './api'
import { AdminUser, AuthResponse, LoginRequest } from '../types/auth'
import { getDeviceFingerprint, getDeviceName } from '../utils/fingerprint'

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const deviceFingerprint = await getDeviceFingerprint()
    const deviceName = getDeviceName()

    const payload = {
      email: credentials.identifier,
      password: credentials.password,
      deviceFingerprint,
      deviceName,
    }

    const response = await api.post('/api/v1/auth/login', payload, {
      headers: {
        'X-Client-Type': 'WEB',
        'X-Device-Fingerprint': deviceFingerprint,
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
    try {
      const deviceFingerprint = await getDeviceFingerprint()
      await api.post(
        '/api/v1/auth/logout',
        {
          deviceFingerprint,
        },
        {
          headers: {
            'X-Client-Type': 'WEB',
            'X-Device-Fingerprint': deviceFingerprint,
          },
        }
      )
    } catch (err) {
      console.warn('Backend logout warning (handled gracefully):', err)
    }
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
    const deviceFingerprint = await getDeviceFingerprint()
    const response = await api.post(
      '/api/v1/auth/refresh',
      {},
      {
        headers: {
          'X-Client-Type': 'WEB',
          'X-Device-Fingerprint': deviceFingerprint,
        },
      }
    )
    const resData = response.data
    if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
      return resData.data
    }
    return resData
  },
}
