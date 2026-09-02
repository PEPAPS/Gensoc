import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed as a GitHub *project* page: https://pepaps.github.io/Gensoc/
// The base path must match the repository name or every asset 404s.
// Override with BASE_PATH=/ when serving from a user/organisation page or a custom domain.
const base = process.env.BASE_PATH ?? '/Gensoc/';

export default defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Recharts and its d3 dependencies are most of the bundle and change far
        // less often than the content does — keep them in a separately cacheable
        // chunk rather than one 775 kB blob.
        //
        // Skipped for SSR builds, where dependencies are external and rollup
        // rejects manual chunks naming them.
        manualChunks: isSsrBuild
          ? undefined
          : {
              charts: ['recharts'],
              react: ['react', 'react-dom', 'react-router-dom'],
            },
      },
    },
  },
}));
