import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { copyFileSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin: copy index.html → 404.html after build for Cloudflare Pages SPA routing
function cloudflareSpaFallback() {
  return {
    name: 'cloudflare-spa-fallback',
    closeBundle() {
      const indexPath = path.resolve(__dirname, 'dist/index.html');
      const notFoundPath = path.resolve(__dirname, 'dist/404.html');
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, notFoundPath);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), cloudflareSpaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
