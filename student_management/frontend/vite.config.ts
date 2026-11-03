import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Send /api calls to the Express backend (keeps the login cookie on one origin).
    proxy: { '/api': 'http://localhost:5001' },
  },
})
