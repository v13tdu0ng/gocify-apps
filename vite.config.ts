import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { SITE_BASE } from './src/lib/site.ts'

export default defineConfig({
  base: SITE_BASE ? `${SITE_BASE}/` : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
