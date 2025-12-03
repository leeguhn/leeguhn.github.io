import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // GitHub Pages will serve from root since this is a user site (leeguhn.github.io)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
