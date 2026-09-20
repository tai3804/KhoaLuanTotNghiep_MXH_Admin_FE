import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    // Fix SPA reload: serve index.html for all non-file routes
    historyApiFallback: true,
    proxy: {
      // Admin API goes DIRECTLY to admin-service (bypass broken gateway routing)
      '/api/v1/admin': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      // Auth, users, posts, etc. go through the gateway
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
