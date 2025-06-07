import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    sourcemap: true,
  },
  worker: {
    format: 'es',
  },
  force: true,
  include: [
    '@jbrowse/core',
    '@gmod/bam',
    // Add other JBrowse dependencies that might be causing issues
  ],
  optimizeDeps: {
    exclude: [],
    entries: []
  }
});
