import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { store } from '../store'
import { setCredentials, logout } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies (refresh token)
})

// Request Interceptor: Attach Access Token from in-memory Redux store
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
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

// Response Interceptor: Handle 401 and refresh token via cookie
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/api/v1/auth/login') || originalRequest.url?.includes('/api/v1/auth/refresh')) {
        // If login or refresh itself fails with 401, don't loop
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Call refresh endpoint with cookie credentials
        const refreshResponse = await axios.post(
          `/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken =
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.data?.accessToken

        const user =
          refreshResponse.data?.user ||
          refreshResponse.data?.data?.user ||
          store.getState().auth.user

        if (newAccessToken && user) {
          store.dispatch(setCredentials({ token: newAccessToken, user }))
          processQueue(null, newAccessToken)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }
          return api(originalRequest)
        } else {
          throw new Error('No access token returned from refresh endpoint')
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null)
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
