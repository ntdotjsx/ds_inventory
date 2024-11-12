import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['jquery', 'jquery-ui-dist']
  },
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
