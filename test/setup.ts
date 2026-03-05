import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

import enUS from '../src/i18n/en-US'

installQuasarPlugin()

// Mock vue-router – preserve real exports but stub composables
vi.mock('vue-router', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      go: vi.fn(),
      currentRoute: { value: { params: {}, query: {}, name: 'test' } }
    }),
    useRoute: () => ({
      params: {},
      query: {},
      name: 'test',
      path: '/',
      meta: {}
    })
  }
})

// Setup i18n for tests
const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  messages: { 'en-US': enUS }
})

config.global.plugins.push(i18n)

// Stub process.env values
process.env.HOST = 'http://localhost:8000'
process.env.STORAGE_PREFIX = 'test'
process.env.CLIENT_SECRET = 'test-secret'
process.env.CLIENT_ID = 'test-client'
process.env.VUE_ROUTER_MODE = 'hash'
process.env.VUE_ROUTER_BASE = '/'

// Global fetch mock
vi.stubGlobal('fetch', vi.fn())
