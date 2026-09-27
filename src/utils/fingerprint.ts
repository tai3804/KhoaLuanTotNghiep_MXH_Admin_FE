import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fpPromise: Promise<any> | null = null

/**
 * Generates or retrieves a persistent, unique browser device fingerprint
 * using FingerprintJS with fallback to local persistent UUID.
 */
export const getDeviceFingerprint = async (): Promise<string> => {
  try {
    const cached = localStorage.getItem('device_fingerprint')
    if (cached && cached.trim()) {
      return cached
    }

    if (!fpPromise) {
      fpPromise = FingerprintJS.load()
    }
    const fp = await fpPromise
    const result = await fp.get()
    const visitorId = result?.visitorId

    if (visitorId) {
      localStorage.setItem('device_fingerprint', visitorId)
      return visitorId
    }
  } catch (error) {
    console.warn('FingerprintJS load failed, using fallback generator:', error)
  }

  // Resilient fallback: UUID-like persistent string
  let fallbackId = localStorage.getItem('device_fingerprint')
  if (!fallbackId) {
    fallbackId =
      'web-' +
      Math.random().toString(36).substring(2, 12) +
      '-' +
      Date.now().toString(36)
    localStorage.setItem('device_fingerprint', fallbackId)
  }
  return fallbackId
}

/**
 * Returns a human-friendly device name (e.g. "Chrome on Windows")
 */
export const getDeviceName = (): string => {
  const ua = navigator.userAgent
  let browser = 'Browser'
  let os = 'Unknown OS'

  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome') && !ua.includes('Edg/')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'

  if (ua.includes('Win')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  return `${browser} on ${os}`
}
