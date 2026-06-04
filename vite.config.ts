import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Context providers (LanguageProvider, AuthProvider) are created once and
// captured by the router at module load. Partial HMR can re-evaluate a
// context module — minting a new context object that the already-mounted
// provider doesn't share — which surfaces as "useX must be used within
// Provider". Forcing a full reload on every change keeps a single, consistent
// module graph and matches the live-pull dev workflow.
function fullReloadOnChange() {
  return {
    name: 'full-reload-on-change',
    handleHotUpdate({ server, file }: { server: any; file: string }) {
      server.config.logger.info(`full reload: ${file.split('/').pop()}`, { timestamp: true });
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    fullReloadOnChange(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        // Split heavy, rarely-changing dependencies into their own chunks so
        // the app shell stays small and vendor code can be cached separately.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          motion: ['motion'],
        },
      },
    },
  },
})
