import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import PostsPage from './pages/PostsPage'
import ReportsPage from './pages/ReportsPage'
import GroupsPage from './pages/GroupsPage'
import BlacklistPage from './pages/BlacklistPage'
import AuditLogsPage from './pages/AuditLogsPage'
import NotFoundPage from './pages/NotFoundPage'

export const App: React.FC = () => {
  const isDark = useAppSelector((state) => state.theme.isDark)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <BrowserRouter>
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
          <Route path="users" element={<UsersPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="blacklist" element={<BlacklistPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
