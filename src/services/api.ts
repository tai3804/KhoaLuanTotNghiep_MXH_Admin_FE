import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { store } from '../store'
import { setCredentials, logout, extractUserFromToken } from '../store/slices/authSlice'
import { getDeviceFingerprint } from '../utils/fingerprint'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies (refresh token)
})

const setAuthHeader = (config: any, token: string) => {
  if (!config.headers) {
    config.headers = {}
  }
  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`)
  } else {
    config.headers['Authorization'] = `Bearer ${token}`
  }
}

// Request Interceptor: Attach Access Token and Device Fingerprint
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token
    if (token) {
      setAuthHeader(config, token)
    }

    if (config.headers) {
      const fingerprint = await getDeviceFingerprint()
      if (fingerprint && !config.headers['X-Device-Fingerprint']) {
        config.headers['X-Device-Fingerprint'] = fingerprint
        config.headers['X-Client-Type'] = 'WEB'
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response Interceptor: Handle 401 and refresh token via cookie or fallback token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/api/v1/auth/login') ||
        originalRequest.url?.includes('/api/v1/auth/refresh') ||
        originalRequest.url?.includes('/api/v1/auth/logout')
      ) {
        // If login, refresh, or logout itself fails with 401, don't loop
        return Promise.reject(error)
      }

      if (isRefreshing) {
        originalRequest._retry = true
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
              setAuthHeader(originalRequest, token as string)
            }
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const fingerprint = await getDeviceFingerprint()
        const refreshUrl = API_BASE_URL ? `${API_BASE_URL}/api/v1/auth/refresh` : '/api/v1/auth/refresh'

        const refreshResponse = await axios.post(
          refreshUrl,
          {}, // Refresh token is carried securely via HttpOnly cookie
          {
            headers: {
              'X-Client-Type': 'WEB',
              'X-Device-Fingerprint': fingerprint,
            },
            withCredentials: true,
          }
        )

        const newAccessToken =
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.data?.accessToken

        const user =
          refreshResponse.data?.user ||
          refreshResponse.data?.data?.user ||
          store.getState().auth.user ||
          (newAccessToken ? extractUserFromToken(newAccessToken) : null) ||
          undefined

        if (newAccessToken) {
          store.dispatch(setCredentials({ token: newAccessToken, user }))
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
          setAuthHeader(originalRequest, newAccessToken)
          processQueue(null, newAccessToken)
          return api(originalRequest)
        } else {
          throw new Error('No access token returned from refresh endpoint')
        }
      } catch (refreshError: any) {
        processQueue(refreshError as Error, null)
        // Only clear credentials if the refresh endpoint explicitly returned 401 or 403
        if (refreshError?.response && (refreshError.response.status === 401 || refreshError.response.status === 403)) {
          localStorage.removeItem('admin_user')
          localStorage.removeItem('admin_refresh_token')
          store.dispatch(logout())
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
