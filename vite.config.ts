import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // event.html = the same app with its own <head> (Open Graph for /event); Vercel rewrites /event to it
      input: { main: 'index.html', event: 'event.html' },
    },
  },
})
