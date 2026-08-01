import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: '.',
  // `mpa` = multi-page app: disables the SPA index.html fallback so visiting
  // `/admin/` actually serves `admin/index.html` and not the root
  // `index.html`. Without this, typing `/admin` can fall through to the
  // storefront.
  appType: 'mpa',
  envPrefix: 'VITE_',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
      },
    },
  },
});
