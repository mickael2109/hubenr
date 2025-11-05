import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon/logo.png', 'icon/logo.png'],
      manifest: {
        name: 'Smillin',
        short_name: 'Smillin',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4a90e2',
        icons: [
          {
            src: 'icon/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    tailwindcss(),
  ],
  base: './',
})
