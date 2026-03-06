import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Product } from '../../../../types/product.interfaces'

import NamePart from '../NamePart.vue'

import { mockProduct, mockProductNoUpdate } from '../../../__tests__/mocks'

// Mock the date utility
vi.mock('../../../../utils/date', () => ({
  toPlainString: vi.fn((date) => date ? '2024-01-01' : '')
}))

const mountComponent = (product: Product) => {
  return mount(NamePart, {
    props: { product }
  })
}

describe('NamePart.vue', () => {
  it('renders product name correctly', () => {
    const wrapper = mountComponent(mockProduct)
    expect(wrapper.text()).toContain('Test Product')
  })

  it('displays stock information with date', () => {
    const wrapper = mountComponent(mockProduct)

    expect(wrapper.text()).toContain('Stock') // Translated text
    expect(wrapper.text()).toContain('50 - 2024-01-01')
  })

  it('handles missing stock update date', () => {
    const wrapper = mountComponent(mockProductNoUpdate)

    expect(wrapper.text()).toContain('Stock') // Translated text
    expect(wrapper.text()).toContain('50 -') // No space after dash when date is empty
  })

  it('has correct item section structure', () => {
    const wrapper = mountComponent(mockProduct)

    const section = wrapper.findComponent({ name: 'QItemSection' })
    expect(section.exists()).toBe(true)

    const labels = wrapper.findAllComponents({ name: 'QItemLabel' })
    expect(labels.length).toBe(2) // Product name and stock info
  })
})
