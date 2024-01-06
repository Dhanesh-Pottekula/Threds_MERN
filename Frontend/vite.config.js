import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://threds-mern.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["lodash", "axios"], // Put lodash and axios into a separate chunk
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust chunk size limit to 1MB
  },
});
