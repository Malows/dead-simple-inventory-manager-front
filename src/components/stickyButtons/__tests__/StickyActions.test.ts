import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import StickyActions from '../StickyActions.vue'

vi.mock('src/composition/components/stickyButtons', () => ({
  useStickyButton: () => ({
    position: 'bottom-right',
    offset: [24, 24],
    direction: 'up',
    icon: 'keyboard_arrow_up'
  })
}))

describe('StickyActions.vue', () => {
  it('renders q-page-sticky component', () => {
    const wrapper = mount(StickyActions)
    expect(wrapper.findComponent({ name: 'QPageSticky' }).exists()).toBe(true)
  })

  it('passes position and offset from useStickyButton hook', () => {
    const wrapper = mount(StickyActions)
    const sticky = wrapper.findComponent({ name: 'QPageSticky' })
    expect(sticky.props('position')).toBe('bottom-right')
    expect(sticky.props('offset')).toEqual([24, 24])
  })

  it('renders q-fab component with correct props', () => {
    const wrapper = mount(StickyActions)
    const fab = wrapper.findComponent({ name: 'QFab' })
    expect(fab.exists()).toBe(true)
    expect(fab.props('icon')).toBe('keyboard_arrow_up')
    expect(fab.props('direction')).toBe('up')
    expect(fab.props('color')).toBe('accent')
  })

  it('uses custom color prop when provided', () => {
    const wrapper = mount(StickyActions, { props: { color: 'primary' } })
    const fab = wrapper.findComponent({ name: 'QFab' })
    expect(fab.props('color')).toBe('primary')
  })

  it('renders slot content inside q-fab', () => {
    const wrapper = mount(StickyActions, {
      slots: { default: '<div class="test-action">Test Action</div>' }
    })
    expect(wrapper.text()).toContain('Test Action')
  })
})
