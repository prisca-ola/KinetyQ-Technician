import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// KinetyQ Technician - responsive web app (web + mobile), no backend at this stage.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5180,
    strictPort: false,
  },
});
