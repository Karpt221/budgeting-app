import dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

const PORT = process.env.PORT || 3001;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/app',
  },
});