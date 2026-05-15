import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      'localhost', 
      '.ngrok-free.dev'
    ],
    port: 5173, 
  }
})