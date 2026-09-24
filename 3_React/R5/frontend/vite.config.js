import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  root: 'public',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 7888,
    strictPort: true,
    open: false
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
