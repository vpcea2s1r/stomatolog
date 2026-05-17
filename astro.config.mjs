import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://stomatolog.ortopednn.ru',
  output: 'static',
  prefetch: {
    prefetchAll: false,
    hover: true
  },
  integrations: [
    sitemap()
  ],
  image: {
    domains: ['stomatolog.ortopednn.ru']
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            alpine: ['alpinejs']
          }
        }
      }
    }
  }
});
