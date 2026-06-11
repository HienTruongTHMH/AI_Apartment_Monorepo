import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@':         path.resolve(__dirname, './src'),
        '@shared':   path.resolve(__dirname, './src/shared'),
        '@features': path.resolve(__dirname, './src/features'),
        '@lib':      path.resolve(__dirname, './src/lib'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core':   ['react', 'react-dom'],
            'motion':       ['motion'],
            'router':       ['react-router'],
            'icons':        ['lucide-react'],
            'charts':       ['recharts'],
            // Page-level chunks — each lazy route loads independently
            'tenant-app':   ['./src/features/tenant/TenantApp'],
            'landlord-app': ['./src/features/landlord/LandlordApp'],
            'admin-app':    ['./src/features/admin/AdminPanel'],
            'portals':      ['./src/features/manager/ManagerApp', './src/features/dev/DevApp'],
            'subpages':     [
              './src/features/shared-pages/ContractsPage',
              './src/features/shared-pages/PaymentsPage',
              './src/features/shared-pages/ReportsPage',
              './src/features/shared-pages/SecurityPage',
            ],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: () => '/v1/messages',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const key = env.ANTHROPIC_API_KEY || ''
              proxyReq.setHeader('x-api-key', key)
              proxyReq.setHeader('anthropic-version', '2023-06-01')
              proxyReq.removeHeader('origin')
            })
          },
        },
        // AI Agent backend (DungGiaIT/AI-integrated-apartments)
        // Run: python -m uvicorn app.main:app --reload  (port 8000)
        '/agent-api': {
          target: env.AGENT_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/agent-api/, ''),
        },
      },
    },
  }
})
