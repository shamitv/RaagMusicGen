import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Use relative paths for built assets
  plugins: [react()],
  server: {
    // During local development, forward API calls to the backend running on localhost:8000
    proxy: {
      // proxy any request starting with /GenerateTune to http://localhost:8000
      '/GenerateTune': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
