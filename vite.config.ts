import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { copyFileSync, existsSync, unlinkSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin: ensure Cloudflare Pages SPA routing works correctly
// 1. Copies index.html → 404.html (so Cloudflare serves the SPA on any route)
// 2. Removes _redirects file if it exists (causes infinite loop error on Cloudflare Pages)
function cloudflareSpaFallback() {
  return {
    name: 'cloudflare-spa-fallback',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      const notFoundPath = path.join(distDir, '404.html');
      const redirectsPath = path.join(distDir, '_redirects');

      // Remove _redirects if it exists (prevents Cloudflare infinite loop error)
      if (existsSync(redirectsPath)) {
        unlinkSync(redirectsPath);
      }

      // Copy index.html → 404.html for SPA routing
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, notFoundPath);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), cloudflareSpaFallback()],
  build: {
    emptyOutDir: true, // Always clean dist before build
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
