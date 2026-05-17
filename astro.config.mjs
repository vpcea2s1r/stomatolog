import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const THEME = process.env.THEME || 'medical';
const THEME_DOMAIN_MAP = { medical: '', warm: '2', premium: '3', purple: '4', experimental: '5' };
const THEME_SUFFIX = THEME_DOMAIN_MAP[THEME] || '';

export default defineConfig({
  site: `https://stomatolog${THEME_SUFFIX}.ortopednn.ru`,
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
