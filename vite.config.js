import { defineConfig } from 'vite';

// Static, single-page premium landing site. Relative base so it can be hosted
// from any path (custom domain, sub-folder, or static host).
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    cssMinify: true,
    assetsInlineLimit: 2048,
  },
});
