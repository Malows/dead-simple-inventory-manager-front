import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import UserMenu from '../UserMenu.vue'

// Mock useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key: string) => key) // Return key as is for simplicity
  })
}))

const mountComponent = (props = {}) =>
  mount(UserMenu, { props: { user: { name: 'Test User' }, ...props } })

describe('UserMenu.vue', () => {
  it('renders the user name in the button and menu', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Test User')
  })

  it('emits logout when logout menu item is clicked', async () => {
    const wrapper = mountComponent()
    const button = wrapper.findComponent({ name: 'QBtn' })
    await button.trigger('click')
    const menuItem = wrapper.findComponent({ name: 'QItem' })
    await menuItem.trigger('click')
    expect(wrapper.emitted('logout')).toBeTruthy()
  })

  it('has correct aria-label from i18n', () => {
    const wrapper = mountComponent()
    const button = wrapper.findComponent({ name: 'QBtn' })
    expect(button.attributes('aria-label')).toBe('common.aria_user')
  })
})
