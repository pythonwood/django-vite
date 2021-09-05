import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })

const { resolve } = require('path');
export default defineConfig({
  base: '/static/vueapp/',
  build: {
    assetsInlineLimit: 10240, // 4096
    emptyOutDir: true,
    manifest: true, // adds a manifest.json
    rollupOptions: {
      input: [
        resolve(__dirname, 'index.html'),
        // resolve(__dirname, 'src/index.html'), // result => ${base}/src/index.html
        resolve(__dirname, 'src/main.js'),
      ]
    },
    outDir:  './static/vueapp', // puts the manifest.json in PROJECT_ROOT/demo/static/
    assetsDir:  'assets', // puts asset files in in PROJECT_ROOT/demo/static/vueapp
  },
  plugins: [vue()],
  server: {
    port: 3001, // make sure this doesn't conflict with other ports you're using
    open: false,
    vite: {
        strict: false,
        // Allow serving files from one level up to the project root
        allow: ['..', '../..', 'http://localhost:8000', '*'],
    },
  },
});
