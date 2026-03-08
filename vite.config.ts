import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let proxyTarget = 'http://localhost:8000';
  try {
    const apiUrl = env.VITE_API_URL || 'http://localhost:8000/api';
    proxyTarget = new URL(apiUrl).origin;
  } catch (e) {
    console.warn("Could not parse VITE_API_URL for proxy target.");
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
