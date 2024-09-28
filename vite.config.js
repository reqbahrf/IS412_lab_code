import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    hot:true,
  },
  plugins: [tailwindcss()],
});