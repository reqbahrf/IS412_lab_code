import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss'

export default defineConfig({
  base: './',
  build: {
    watch: true,
    outDir: 'dist',
    input: {
      main: 'index.html',
      home: '../pages/home.html',
      login: '../pages/login.html',
    },
  },
  server: {
    watch: true,
    port: 3000,
    hmr:{
      overlay: true
    }
  },
  plugins: [tailwindcss()],
});