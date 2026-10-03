import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import { PageSkeleton } from './components/common/Skeleton'

// Code-split page components for high-speed initial bundle
const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const PostsPage = lazy(() => import('./pages/PostsPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const GroupsPage = lazy(() => import('./pages/GroupsPage'))
const BlacklistPage = lazy(() => import('./pages/BlacklistPage'))
const AiModerationPage = lazy(() => import('./pages/AiModerationPage'))
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export const App: React.FC = () => {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)

  const isModerator =
    user?.role === 'MODERATOR' ||
    (user?.roles && user.roles.includes('ROLE_MODERATOR') && !user.roles.includes('ROLE_ADMIN'))

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route
              path="users"
              element={isModerator ? <Navigate to="/" replace /> : <UsersPage />}
            />
            <Route path="posts" element={<PostsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route
              path="groups"
              element={isModerator ? <Navigate to="/" replace /> : <GroupsPage />}
            />
            <Route path="blacklist" element={<BlacklistPage />} />
            <Route path="ai-moderation" element={<AiModerationPage />} />
            <Route
              path="audit-logs"
              element={isModerator ? <Navigate to="/" replace /> : <AuditLogsPage />}
            />
            <Route
              path="settings"
              element={isModerator ? <Navigate to="/" replace /> : <SettingsPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
