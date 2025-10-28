import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Surveiller les changements dans le dossier shared
      ignored: ['!**/shared/**']
    }
  },
  resolve: {
    alias: {
      '@cube-explorer/shared': path.resolve(__dirname, '../shared/src')
    }
  }
})
