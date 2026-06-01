import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lobbyist-donation-tracker/',
  server: {
    proxy: {
      '/lda-api': {
        target: 'https://lda.senate.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lda-api/, '/api/v1'),
      },
    },
  },
})
