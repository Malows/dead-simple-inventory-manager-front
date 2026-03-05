import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Import the component
import StickyBtn from '../StickyBtn.vue'

// Mock the composition function
vi.mock('../../composition/components/stickyButtons', () => ({
  useStickyButton: vi.fn(() => ({
    position: 'top-right',
    offset: [24, 24]
  }))
}))

describe('StickyBtn.vue', () => {
  const createWrapper = (props = {}) => {
    return mount(StickyBtn, {
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

    // Since we're stubbing q-page-sticky, check that the component structure is correct
    const sticky = wrapper.findComponent({ name: 'q-page-sticky' })
    expect(sticky.exists()).toBe(true)
  })

  it('renders with custom props', () => {
    const wrapper = createWrapper({
      icon: 'edit',
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
