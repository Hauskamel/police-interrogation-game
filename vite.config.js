import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@devtools': path.resolve(__dirname, 'src/devtools'),
      '@game': path.resolve(__dirname, 'src/game'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: [
        'src/game/documents/generators/createDocumentState.js',
        'src/game/documents/generators/create*PresentedProfile.js',
        'src/game/documents/generators/createPresentedProfiles.js',
        'src/game/documents/generators/generateIssueAndExpiryDate.js',
        'src/game/documents/generators/generateInsuranceProfile.js',
        'src/game/inspections/generators/createInspectionSession.js',
        'src/game/inspections/utils/evaluateInspection.js',
        'src/game/shared/gameTime.js',
        'src/game/shared/utils/createEntityId.js',
        'src/stores/commitTrafficEntityRecords.js',
        'src/stores/inspectionStore.js',
        'src/stores/officialRegistryStore.js',
        'src/stores/trafficStore.js',
        'src/stores/worldTruthStore.js',
      ],
    },
  },
})
