import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(currentDir, 'src')}/`,
      '@byjohann/vue-i18n': resolve(currentDir, '../src/index.ts'),
    },
  },

  plugins: [Vue()],

  optimizeDeps: {
    exclude: [
      '@byjohann/vue-i18n',
    ],
  },
})
