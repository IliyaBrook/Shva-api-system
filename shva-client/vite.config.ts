import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000/api',
        changeOrigin: true,
        // secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
})
