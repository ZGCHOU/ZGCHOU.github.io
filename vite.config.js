import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/deyou/',
  build: {
    outDir: 'dist/deyou',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
    // 生产环境移除所有 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
