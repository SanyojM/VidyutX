import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.js',
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'VidyutX',
      short_name: 'VidyutX',
      description: 'VidyutX is a cutting-edge web-based code editor designed for speed, efficiency, and precision. With lightning-fast performance, an intuitive interface, and advanced syntax highlighting, it provides a seamless coding experience. Ideal for both beginners and experienced developers, VidyutX offers a dynamic environment to bring your projects to life.',
      theme_color: '#171924',
    },

    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})