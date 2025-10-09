import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // Proxy to Kestrel
    proxy: {
      '/api': {
        target: 'http://localhost:5010',
        changeOrigin: true,
        ws: true
      },
      '/swagger': {
        target: 'http://localhost:5010',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:5010',
        changeOrigin: true
      }
    }
  },
  // In prod: emit the SPA into Api/wwwroot so Kestrel can serve it
  build: {
    outDir: resolve(__dirname, '../Api/wwwroot'),
    emptyOutDir: true
  }
})
