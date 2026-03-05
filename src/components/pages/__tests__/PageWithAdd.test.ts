import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import PageWithAdd from '../PageWithAdd.vue'

describe('PageWithAdd.vue', () => {
  it('renders title correctly', () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page Title'
      }
    })

    const title = wrapper.find('h4')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Test Page Title')
  })

  it('renders empty title when not provided', () => {
    const wrapper = mount(PageWithAdd)

    const title = wrapper.find('h4')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('')
  })

  it('renders StickyPath when to prop is provided', () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page',
        to: '/test-route'
      }
    })

    const stickyPath = wrapper.findComponent({ name: 'StickyPath' })
    expect(stickyPath.exists()).toBe(true)
    expect(stickyPath.props('to')).toBe('/test-route')
    expect(stickyPath.props('icon')).toBe('add')

    // Should not render StickyBtn
    const stickyBtn = wrapper.findComponent({ name: 'StickyBtn' })
    expect(stickyBtn.exists()).toBe(false)
  })

  it('renders StickyBtn when to prop is null', async () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page',
        to: null
      }
    })

    const stickyBtn = wrapper.findComponent({ name: 'StickyBtn' })
    expect(stickyBtn.exists()).toBe(true)
    expect(stickyBtn.props('icon')).toBe('add')

    // Should not render StickyPath
    const stickyPath = wrapper.findComponent({ name: 'StickyPath' })
    expect(stickyPath.exists()).toBe(false)
  })

  it('renders StickyBtn when to prop is not provided', () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page'
      }
    })

    const stickyBtn = wrapper.findComponent({ name: 'StickyBtn' })
    expect(stickyBtn.exists()).toBe(true)
    expect(stickyBtn.props('icon')).toBe('add')

    // Should not render StickyPath
    const stickyPath = wrapper.findComponent({ name: 'StickyPath' })
    expect(stickyPath.exists()).toBe(false)
  })

  it('emits click event when StickyBtn is clicked', async () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page'
      }
    })

    const stickyBtn = wrapper.findComponent({ name: 'StickyBtn' })
    await stickyBtn.vm.$emit('click')

    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders slot content', () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page'
      },
      slots: {
        default: '<div class="test-content">Test slot content</div>'
      }
    })

    const slotContent = wrapper.find('.test-content')
    expect(slotContent.exists()).toBe(true)
    expect(slotContent.text()).toBe('Test slot content')
  })

  it('has correct page structure', () => {
    const wrapper = mount(PageWithAdd, {
      props: {
        title: 'Test Page'
      }
    })

    const page = wrapper.findComponent({ name: 'QPage' })
    expect(page.exists()).toBe(true)
    expect(page.props('padding')).toBe(true)
  })
})
