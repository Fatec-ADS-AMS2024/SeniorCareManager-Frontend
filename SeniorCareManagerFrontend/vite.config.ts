import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Essa opção deve ser a mesma que a definida em tsconfig.app.json
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7053',
        changeOrigin: true,
        secure: false, // Ignora certificados SSL auto-assinados
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
