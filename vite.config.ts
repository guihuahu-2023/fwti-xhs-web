import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  // Hash-based routing + relative assets keep the build deployable from any
  // GitHub Pages repository path without a server-side rewrite.
  base: './',
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
