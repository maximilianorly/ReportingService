import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_PROXY_TARGET || 'http://api:8080'

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api':     { target: apiTarget, changeOrigin: true, ws: true },
        '/swagger': { target: apiTarget, changeOrigin: true },
        '/health':  { target: apiTarget, changeOrigin: true },
      },
    },
    build: {
      outDir: resolve(__dirname, '../Api/wwwroot'),
      emptyOutDir: true,
    },
  })
}
