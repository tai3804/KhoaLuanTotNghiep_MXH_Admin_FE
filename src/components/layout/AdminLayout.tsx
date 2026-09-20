import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'
import ToastContainer from '../common/Toast'

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb] transition-colors">
      {/* Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Toast Alert Notifications */}
      <ToastContainer />
    </div>
  )
}

export default AdminLayout
