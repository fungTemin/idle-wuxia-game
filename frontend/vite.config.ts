import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('zustand')) {
              return 'store';
            }
            if (id.includes('axios')) {
              return 'http';
            }
            return 'vendor';
          }
        }
      }
    },
    // 分包大小警告阈值
    chunkSizeWarningLimit: 1000,
  }
})
