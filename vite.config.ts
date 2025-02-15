import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "src/assets/icon-16.png", dest: "assets" },
        { src: "src/assets/icon-32.png", dest: "assets" },
        { src: "src/assets/icon-48.png", dest: "assets" },
        { src: "src/assets/icon-128.png", dest: "assets" },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    // minify: 'terser',
    // sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        content: resolve(__dirname, "content.html"),
        // serviceWorkers: resolve(__dirname, "src/serviceWorkers.js"),
      },
      output: {
        entryFileNames: "[name].js",
        manualChunks: () => 'everything.js',
      },
    }
  }
})
