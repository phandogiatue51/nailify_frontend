import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    allowedHosts: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000,
      },
      manifest: {
        name: "Nailify",
        short_name: "Nailify",
        start_url: "/",
        display: "standalone",
        background_color: "#ffcfe9",
        theme_color: "#950101",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        screenshots: [
          {
            src: "/screenshot-mobile.png",
            sizes: "375x667",
            type: "image/png",
          },
          {
            src: "/screenshot-desktop.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // UI Library chunks
            if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("sonner")) {
              return "vendor-ui";
            }
            // React core chunks
            if (id.includes("react") || id.includes("scheduler") || id.includes("use-callback-ref")) {
              return "vendor-react";
            }
            // Form handling chunks
            if (id.includes("react-hook-form") || id.includes("zod") || id.includes("@hookform")) {
              return "vendor-forms";
            }
            // Date handling chunks
            if (id.includes("date-fns") || id.includes("react-day-picker")) {
              return "vendor-dates";
            }
            // Icon chunks (largest)
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            // Other large UI libraries
            if (id.includes("lucide-react")) {
              return "vendor-icons-lucide";
            }
            // TanStack Query
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            return id.split("node_modules/")[1].split("/")[0];
          }
        },
      },
    },
  },
});