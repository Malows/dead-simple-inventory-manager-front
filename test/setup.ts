import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

import enUS from '../src/i18n/en-US'

// Mock quasar – preserve real component exports but stub composables
vi.mock('quasar', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useQuasar: () => ({
      loading: { show: vi.fn(), hide: vi.fn() },
      notify: vi.fn(),
      dialog: vi.fn(() => ({ onOk: vi.fn(), onCancel: vi.fn() })),
      screen: { lt: { sm: false }, gt: { sm: true } },
      dark: { isActive: false }
    })
  }
})

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

// Import Quasar components (from mock which spreads real exports)
import {
  QBtn,
  QInput,
  QItem,
  QItemSection,
  QItemLabel,
  QList,
  QSeparator,
  QIcon,
  QSelect,
  QToggle,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QPage,
  QPageSticky,
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QToolbar,
  QToolbarTitle,
  QHeader,
  QLayout,
  QPageContainer,
  QDrawer,
  QMenu,
  QImg,
  QFile,
  QSpinner,
  QFab,
  QPagination,
  QForm,
  QCheckbox
} from 'quasar'

// Register Quasar components globally so shallowMount can stub them
const quasarComponents: Record<string, object> = {
  QBtn,
  QInput,
  QItem,
  QItemSection,
  QItemLabel,
  QList,
  QSeparator,
  QIcon,
  QSelect,
  QToggle,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QPage,
  QPageSticky,
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QToolbar,
  QToolbarTitle,
  QHeader,
  QLayout,
  QPageContainer,
  QDrawer,
  QMenu,
  QImg,
  QFile,
  QSpinner,
  QFab,
  QPagination,
  QForm,
  QCheckbox
}

config.global.components = config.global.components || {}
for (const [name, component] of Object.entries(quasarComponents)) {
  (config.global.components as Record<string, object>)[name] = component
}

// Stub Quasar directives
config.global.directives = { 'close-popup': {} }

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
