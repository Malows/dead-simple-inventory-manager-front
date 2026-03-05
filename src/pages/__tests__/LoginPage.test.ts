import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import LoginPage from '../LoginPage.vue'
import { useSessionStore } from '../../stores/session'

const { mockPush, mockNotify, mockLoadingShow, mockLoadingHide } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockNotify: vi.fn(),
  mockLoadingShow: vi.fn(),
  mockLoadingHide: vi.fn()
}))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      go: vi.fn(),
      currentRoute: { value: { params: {}, query: {}, name: 'test' } }
    })),
    useRoute: () => ({
      params: {},
      query: {},
      name: 'test',
      path: '/',
      meta: {}
    })
  }
})

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as any,
    useQuasar: vi.fn(() => ({
      loading: { show: mockLoadingShow, hide: mockLoadingHide },
      notify: mockNotify
    }))
  }
})

vi.stubEnv('NAME', 'Test App')

describe('LoginPage.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let store: ReturnType<typeof useSessionStore>

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({ createSpy: vi.fn })
    store = useSessionStore(pinia)
    vi.mocked(store.login).mockResolvedValue({ isOk: true })
  })

  const mountComponent = () =>
    mount(LoginPage, {
      global: {
        plugins: [pinia]
      }
    })

  it('renders login form', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'QForm' }).exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'QInput' })).toHaveLength(2)
    expect(wrapper.findComponent({ name: 'QBtn' }).exists()).toBe(true)
  })

  it('displays app name', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Test App')
  })

  it('calls login on form submit', async () => {
    const wrapper = mountComponent();
    (wrapper.vm as any).username = 'testuser';
    (wrapper.vm as any).password = 'testpass'
    const form = wrapper.findComponent({ name: 'QForm' })
    await form.trigger('submit')
    await flushPromises()
    expect(store.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    })
  })

  it('navigates to index on successful login', async () => {
    const wrapper = mountComponent();
    (wrapper.vm as any).username = 'testuser';
    (wrapper.vm as any).password = 'testpass'
    const form = wrapper.findComponent({ name: 'QForm' })
    await form.trigger('submit')
    await flushPromises()
    expect(mockPush).toHaveBeenCalledWith({ name: 'index' })
  })

  it('shows error notification on failed login', async () => {
    vi.mocked(store.login).mockResolvedValue({ isOk: false })
    const wrapper = mountComponent();
    (wrapper.vm as any).username = 'testuser';
    (wrapper.vm as any).password = 'testpass'
    const form = wrapper.findComponent({ name: 'QForm' })
    await form.trigger('submit')
    await flushPromises()
    expect(mockNotify).toHaveBeenCalled()
  })
})
