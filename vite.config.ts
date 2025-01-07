import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/sand/api': {
  //       target: 'https://api.sand.internal.mx',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/sand\/api/, ''),
  //     },
  //     '/qa/api': {
  //       target: 'https://api.qa.internal.mx',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/qa\/api/, ''),
  //     },
  //     '/int/api': {
  //       target: 'https://int-api.mx.com',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/int\/api/, ''),
  //     },
  //   },
  // },
  plugins: [react()],
})
