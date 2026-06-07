import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "child_process";

// Auto cache-bust favicons and other unhashed /public/ assets on every release.
// Vite already content-hashes JS/CSS bundles, but files under /public are served
// verbatim. We inject the current git short SHA as a ?v= query string into the
// favicon <link> hrefs in index.html — a new commit changes the URL so browsers
// (which cache favicons very aggressively) refetch on next page load.
function cacheBustStaticAssets(): Plugin {
  let version: string;
  try {
    version = execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    version = Date.now().toString(36);
  }
  return {
    name: "cache-bust-static-assets",
    transformIndexHtml(html) {
      return html.replace(
        /href="(\/(?:favicon[^"]*|apple-touch-icon[^"]*))"/g,
        `href="$1?v=${version}"`,
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    cacheBustStaticAssets(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Ensure Node.js modules are not bundled in the frontend
        return id === 'pg' || id === 'fs' || id === 'path' || id === 'crypto' || id.startsWith('node:');
      }
    }
  },
  define: {
    // Remove database URL from frontend build
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
}));
