import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  isDark: boolean
  isSidebarCollapsed: boolean
}

const getInitialTheme = (): boolean => {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') return false
    if (stored === 'dark') return true
    return true // Default dark mode to match social network theme
  } catch {
    return true
  }
}

const getInitialSidebarState = (): boolean => {
  try {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  } catch {
    return false
  }
}

const initialDark = getInitialTheme()
if (typeof document !== 'undefined') {
  if (initialDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const initialState: ThemeState = {
  isDark: initialDark,
  isSidebarCollapsed: getInitialSidebarState(),
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
      try {
        localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
      } catch {
        // ignore
      }
      if (typeof document !== 'undefined') {
        if (state.isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload
      try {
        localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
      } catch {
        // ignore
      }
      if (typeof document !== 'undefined') {
        if (action.payload) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
      try {
        localStorage.setItem('sidebar_collapsed', String(state.isSidebarCollapsed))
      } catch {
        // ignore
      }
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
      try {
        localStorage.setItem('sidebar_collapsed', String(action.payload))
      } catch {
        // ignore
      }
    },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed } =
  themeSlice.actions

export default themeSlice.reducer
