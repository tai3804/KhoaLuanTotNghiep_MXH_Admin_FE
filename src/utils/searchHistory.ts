const SEARCH_HISTORY_KEY = 'mxh_admin_search_history'
const MAX_HISTORY_ITEMS = 8

export const getSearchHistory = (): string[] => {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const addSearchHistory = (query: string): string[] => {
  const trimmed = query.trim()
  if (!trimmed || trimmed.length < 2) return getSearchHistory()

  try {
    const current = getSearchHistory()
    // Remove if already exists, then prepend to the top
    const updated = [trimmed, ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_HISTORY_ITEMS
    )
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

export const removeSearchHistoryItem = (keyword: string): string[] => {
  try {
    const current = getSearchHistory()
    const updated = current.filter((item) => item.toLowerCase() !== keyword.toLowerCase())
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  } catch {
    // Ignore storage errors
  }
}
