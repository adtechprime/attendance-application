import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),   // Self-signed SSL cert for Camera & GPS on LAN devices
  ],
  server: {
    host: '0.0.0.0',   // Expose on LAN for mobile testing
    port: 5173,
    // Proxy /api/* to the Express sync backend — avoids Mixed Content blocking
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
