import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

const httpsConfig = fs.existsSync('.cert/key.pem')
  ? {
      key: fs.readFileSync('.cert/key.pem'),
      cert: fs.readFileSync('.cert/cert.pem'),
    }
  : undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    https: httpsConfig,
  },
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
    },
  },
})
