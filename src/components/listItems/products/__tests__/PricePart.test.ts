import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Product } from '../../../../types/product.interfaces'

import PricePart from '../PricePart.vue'

import { mockProduct, mockProductNoPrice, mockProductNoPriceUpdate } from './mocks'

// Mock the utilities
vi.mock('../../../../utils/date', () => ({
  toPlainString: vi.fn((date) => date ? '2024-01-01' : '')
}))

vi.mock('../../../../utils/text', () => ({
  parsePrice: vi.fn((price) => `$${price}`)
}))

const mountComponent = (product: Product) => {
  return mount(PricePart, {
    props: { product }
  })
}

describe('PricePart.vue', () => {
  it('renders formatted price correctly', () => {
    const wrapper = mountComponent(mockProduct)
    expect(wrapper.text()).toContain('$100')
  })

  it('renders "no asignado" when product has no price', () => {
    const wrapper = mountComponent(mockProductNoPrice)
    expect(wrapper.text()).toContain('no asignado')
  })

  it('displays last price update date when available', () => {
    const wrapper = mountComponent(mockProduct)
    expect(wrapper.text()).toContain('2024-01-01')
  })

  it('does not display date when last_price_update is missing', () => {
    const wrapper = mountComponent(mockProductNoPriceUpdate)

    expect(wrapper.text()).toContain('$100')
    expect(wrapper.text()).not.toContain('2024-01-01')
  })

  it('has avatar section structure', () => {
    const wrapper = mountComponent(mockProduct)

    const section = wrapper.findComponent({ name: 'QItemSection' })
    expect(section.exists()).toBe(true)
    expect(section.props('avatar')).toBe(true)
  })
})
