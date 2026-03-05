import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ProductItem from '../ProductItem.vue'

import { mockFullProduct, mockLowStockProduct, mockNoStockProduct } from './mocks'

const mountComponent = (props = {}) => {
  return mount(ProductItem, {
    props: { product: mockFullProduct, ...props }
  })
}

describe('ProductItem.vue', () => {
  it('renders as a clickable QItem', () => {
    const wrapper = mountComponent()

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.exists()).toBe(true)
    expect(item.props('clickable')).toBe(true)
  })

  it('navigates to product show page', () => {
    const wrapper = mountComponent()

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.props('to')).toEqual({
      name: 'products show',
      params: { productId: 'product-uuid-123' }
    })
  })

  it('shows check icon with positive color when stock is above threshold', () => {
    const wrapper = mountComponent()

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('name')).toBe('check')
    expect(icon.props('color')).toBe('positive')
  })

  it('shows warning icon with warning color when stock is low but above zero', () => {
    const wrapper = mountComponent({ product: mockLowStockProduct })

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('name')).toBe('warning')
    expect(icon.props('color')).toBe('warning')
  })

  it('shows error icon with negative color when stock is zero', () => {
    const wrapper = mountComponent({ product: mockNoStockProduct })

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('name')).toBe('error')
    expect(icon.props('color')).toBe('negative')
  })

  it('has an avatar section with the stock icon', () => {
    const wrapper = mountComponent()

    const section = wrapper.findComponent({ name: 'QItemSection' })
    expect(section.exists()).toBe(true)
    expect(section.props('avatar')).toBe(true)
  })
})
