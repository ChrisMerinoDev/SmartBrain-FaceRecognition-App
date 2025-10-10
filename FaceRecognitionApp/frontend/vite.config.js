import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Local dev proxy (only active in dev mode)
  server: {
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
            },
          }
        : undefined,
  },
}));
