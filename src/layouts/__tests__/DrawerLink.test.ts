import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import DrawerLink from '../DrawerLink.vue'

// Mock useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key: string) => key) // Return key as is
  })
}))

const mountComponent = (props = {}) =>
  mount(DrawerLink, { props: { link: { to: '/test', label: 'test.label', icon: 'test_icon' }, ...props } })

describe('DrawerLink.vue', () => {
  it('renders the link label from i18n', () => {
    const wrapper = mountComponent()
    const label = wrapper.findComponent({ name: 'QItemLabel' })
    expect(label.text()).toBe('test.label')
  })

  it('renders the icon when provided', () => {
    const wrapper = mountComponent()
    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('test_icon')
  })

  it('does not render icon when not provided', () => {
    const wrapper = mountComponent({ link: { to: '/test', label: 'test.label' } })
    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.exists()).toBe(false)
  })

  it('passes to prop to q-item', () => {
    const wrapper = mountComponent()
    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.props('to')).toBe('/test')
  })
})
