import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MainLayout from '../MainLayout.vue'

// Mock dependencies
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    useQuasar: () => ({
      loading: { show: vi.fn(), hide: vi.fn() }
    })
  }
})
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))
vi.mock('../../composition/useWebVitals', () => ({
  useWebVitals: vi.fn()
}))
vi.mock('../../stores/session', () => ({
  useSessionStore: () => ({
    user: { name: 'Test User' },
    logout: vi.fn(),
    fetchUserData: vi.fn()
  })
}))
vi.mock('../../stores/categories', () => ({
  useCategoriesStore: () => ({
    getCategories: vi.fn().mockResolvedValue({ code: 200 })
  })
}))
vi.mock('../../stores/suppliers', () => ({
  useSuppliersStore: () => ({
    getSuppliers: vi.fn().mockResolvedValue({ code: 200 })
  })
}))

describe('MainLayout.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders', () => {
    const wrapper = mount(MainLayout, {
      global: {
        stubs: ['router-view', 'user-menu', 'left-drawer']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
