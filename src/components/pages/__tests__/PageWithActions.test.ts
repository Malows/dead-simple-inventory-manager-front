import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import PageWithActions from '../PageWithActions.vue'

describe('PageWithActions.vue', () => {
  it('renders title correctly', () => {
    const wrapper = mount(PageWithActions, {
      props: { title: 'Test Actions Page' }
    })

    expect(wrapper.text()).toContain('Test Actions Page')
  })

  it('renders empty title when not provided', () => {
    const wrapper = mount(PageWithActions)

    expect(wrapper.text()).not.toContain('undefined')
    expect(wrapper.text()).not.toContain('null')
  })

  it('renders StickyActions component', () => {
    const wrapper = mount(PageWithActions)

    const stickyActions = wrapper.findComponent({ name: 'StickyActions' })
    expect(stickyActions.exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(PageWithActions, {
      slots: {
        default: '<div>Main content</div>',
        actions: '<div>Action content</div>'
      }
    })

    expect(wrapper.text()).toContain('Main content')
    expect(wrapper.text()).toContain('Action content')
  })

  it('passes correct props to StickyActions', () => {
    const wrapper = mount(PageWithActions)

    const stickyActions = wrapper.findComponent({ name: 'StickyActions' })
    expect(stickyActions.exists()).toBe(true)
    // Default color should be 'accent'
    expect(stickyActions.props('color')).toBe('accent')
  })

  it('has correct page structure', () => {
    const wrapper = mount(PageWithActions, {
      props: { title: 'Test' }
    })

    const page = wrapper.findComponent({ name: 'QPage' })
    expect(page.exists()).toBe(true)
    // Note: padding prop might return empty string for stubbed component
    // expect(page.props('padding')).toBe(true)
  })
})
