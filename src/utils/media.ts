/**
 * Transforms direct AWS S3 URLs to backend proxy URL if needed,
 * preventing 403 Forbidden when accessing objects in private S3 buckets.
 */
export const getMediaUrl = (url?: string): string => {
  if (!url) return ''
  if (url.startsWith('/')) return url
  if (url.includes('s3.amazonaws.com/') || url.includes('.s3.') || url.includes('amazonaws.com')) {
    const parts = url.split('amazonaws.com/')
    if (parts.length > 1) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'
      const cleanBase = baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`
      return `${cleanBase}/media/files/${parts[1]}`
    }
  }
  return url
}
