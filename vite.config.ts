import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
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
