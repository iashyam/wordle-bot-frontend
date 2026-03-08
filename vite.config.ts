import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const apiUrl = env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("CRITICAL: VITE_API_URL environment variable is missing. Please set it in your environment/production settings.");
  }

  let proxyTarget: string;
  try {
    proxyTarget = new URL(apiUrl).origin;
  } catch (e) {
    throw new Error(`CRITICAL: VITE_API_URL (${apiUrl}) is not a valid URL.`);
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-health-check',
        configureServer(server) {
          server.httpServer?.once('listening', () => {
            setTimeout(() => {
              fetch(`${apiUrl}/health`)
                .then(res => {
                  if (res.ok) console.log("backend connected");
                  else console.log("backend not connected");
                })
                .catch(() => {
                  console.log("backend not connected");
                });
            }, 100); // Small delay to print after native Vite logs
          });
        }
      }
    ],
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
