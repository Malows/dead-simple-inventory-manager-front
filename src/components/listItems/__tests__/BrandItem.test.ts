import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BrandItem from '../BrandItem.vue'

import { mockBrand, mockBrandNoProducts } from '../../__tests__/mocks'

describe('BrandItem.vue', () => {
  it('renders brand name correctly', () => {
    const wrapper = mount(BrandItem, {
      props: { brand: mockBrand }
    })

    expect(wrapper.text()).toContain('Test Brand')
  })

  it('displays product count correctly', () => {
    const wrapper = mount(BrandItem, {
      props: { brand: mockBrand }
    })

    expect(wrapper.text()).toContain('3 products') // Translated text
  })

  it('displays zero products for empty brand', () => {
    const wrapper = mount(BrandItem, {
      props: { brand: mockBrandNoProducts }
    })

    expect(wrapper.text()).toContain('no products')
  })

  it('has clickable item with correct route', () => {
    const wrapper = mount(BrandItem, {
      props: { brand: mockBrand }
    })

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.exists()).toBe(true)
    expect(item.props('clickable')).toBe(true)
    expect(item.props('to')).toEqual({
      name: 'brands show',
      params: { brandId: 'brand-uuid-123' }
    })
  })
})
