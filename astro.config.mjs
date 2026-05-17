import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const THEME = process.env.THEME || 'medical';
const THEME_DOMAIN = THEME === 'medical' ? '' : THEME;

export default defineConfig({
  site: `https://stomatolog${THEME_DOMAIN}.ortopednn.ru`,
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
