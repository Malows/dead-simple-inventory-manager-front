import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import LeftDrawer from '../LeftDrawer.vue'
import type { Link } from '../../types'

// Mock DRAWER_ITEMS
vi.mock('../../constants', () => ({
  DRAWER_ITEMS: [
    { to: '/home', label: 'common.Home', icon: 'home' },
    { to: '/products', label: 'products.Products', icon: 'bubble_chart' }
  ] as Link[]
}))

const mountComponent = (props = {}) =>
  mount(LeftDrawer, { props })

describe('LeftDrawer.vue', () => {
  it('renders drawer-links for each DRAWER_ITEMS', () => {
    const wrapper = mountComponent()
    const links = wrapper.findAllComponents({ name: 'DrawerLink' })
    expect(links).toHaveLength(2)
  })

  it('passes link prop to drawer-link components', () => {
    const wrapper = mountComponent()
    const links = wrapper.findAllComponents({ name: 'DrawerLink' })
    expect(links.at(0)?.props('link')).toEqual({
      to: '/home',
      label: 'common.Home',
      icon: 'home'
    })
  })
})
