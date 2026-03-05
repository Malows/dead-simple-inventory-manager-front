import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Import the component
import StickyPath from '../StickyPath.vue'

// Mock the composition function
vi.mock('../../composition/components/stickyButtons', () => ({
  useStickyButton: vi.fn(() => ({
    position: 'top-right',
    offset: [24, 24]
  }))
}))

describe('StickyPath.vue', () => {
  const createWrapper = (props = {}) => {
    return mount(StickyPath, {
      props,
      global: {
        stubs: ['q-page-sticky']
      }
    })
  }

  it('renders with default props', () => {
    const wrapper = createWrapper()

    // Test that the component renders
    expect(wrapper.exists()).toBe(true)

    // Check that q-page-sticky is rendered
    const sticky = wrapper.findComponent({ name: 'q-page-sticky' })
    expect(sticky.exists()).toBe(true)
  })

  it('renders with custom props', () => {
    const wrapper = createWrapper({
      icon: 'edit',
      to: '/products',
      size: 'lg',
      color: 'primary'
    })

    // Test that component still renders with custom props
    expect(wrapper.exists()).toBe(true)
    const sticky = wrapper.findComponent({ name: 'q-page-sticky' })
    expect(sticky.exists()).toBe(true)
  })

  it('passes position and offset to q-page-sticky', () => {
    const wrapper = createWrapper()

    const sticky = wrapper.findComponent({ name: 'q-page-sticky' })
    expect(sticky.props('position')).toBe('top-right') // Desktop platform
    expect(sticky.props('offset')).toEqual([24, 24])
  })
})
