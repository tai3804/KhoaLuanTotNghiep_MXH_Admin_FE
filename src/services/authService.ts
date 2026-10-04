import axios from 'axios'
import api from './api'
import { AdminUser, AuthResponse, LoginRequest } from '../types/auth'
import { getDeviceFingerprint, getDeviceName } from '../utils/fingerprint'
import { extractUserFromToken } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

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
    const data: any = (resData && typeof resData === 'object' && 'data' in resData && resData.data)
      ? resData.data
      : resData

    if (data) {
      // NOTE: DO NOT store refreshToken in localStorage! It is handled strictly via HttpOnly cookie.
      return data
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
    } finally {
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_refresh_token')
    }
  },

  getCurrentUser: async (): Promise<AdminUser | null> => {
    try {
      const response = await api.get('/api/v1/users/profile/me')
      const resData = response.data
      const raw = (resData && typeof resData === 'object' && 'data' in resData && resData.data)
        ? resData.data
        : resData
      if (raw) {
        const nameParts = [raw.lastName, raw.middleName, raw.firstName].filter((s) => Boolean(s && String(s).trim()))
        const fullName = nameParts.length > 0 ? nameParts.join(' ').trim() : raw.fullName || raw.username || 'Admin'
        return {
          id: String(raw.userId || raw.id || 'admin'),
          username: raw.username || raw.email?.split('@')[0] || 'admin',
          email: raw.email || '',
          fullName,
          avatarUrl: raw.avatarUrl || raw.avatar || undefined,
          role: 'ADMIN',
          isActive: true,
        }
      }
    } catch (e) {
      console.warn('Could not fetch user profile from /api/v1/users/profile/me:', e)
    }
    return null
  },

  refreshToken: async (): Promise<{ accessToken: string; user?: AdminUser }> => {
    const deviceFingerprint = await getDeviceFingerprint()

    const refreshUrl = API_BASE_URL ? `${API_BASE_URL}/api/v1/auth/refresh` : '/api/v1/auth/refresh'
    const response = await axios.post(
      refreshUrl,
      {}, // Carried strictly via HttpOnly cookie
      {
        headers: {
          'X-Client-Type': 'WEB',
          'X-Device-Fingerprint': deviceFingerprint,
        },
        withCredentials: true,
      }
    )

    const resData = response.data
    const data: any = (resData && typeof resData === 'object' && 'data' in resData && resData.data)
      ? resData.data
      : resData

    const accessToken = data?.accessToken || data?.token
    if (!accessToken) {
      throw new Error('Không lấy được token truy cập từ máy chủ')
    }

    let user = data?.user
    if (!user && accessToken) {
      user = extractUserFromToken(accessToken) || undefined
    }

    return {
      accessToken,
      user,
    }
  },
}

