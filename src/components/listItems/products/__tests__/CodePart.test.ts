import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Product } from '../../../../types/product.interfaces'

import CodePart from '../CodePart.vue'

// Import mocks
import { mockProduct, mockProductNoCode } from './mocks'

const mountComponent = (product: Product, props = {}) => {
  return mount(CodePart, {
    props: { ...props, product }
  })
}

describe('CodePart.vue', () => {
  it('renders product code with default padding', () => {
    const wrapper = mountComponent(mockProduct)
    expect(wrapper.text()).toContain('cod: PROD-001')
  })

  it('renders "no asignado" when product has no code', () => {
    const wrapper = mountComponent(mockProductNoCode)
    expect(wrapper.text()).toContain('cod: no asignado')
  })

  it('applies padding correctly', () => {
    const wrapper = mountComponent(mockProduct, { padding: 10 })
    expect(wrapper.text()).toContain('cod:   PROD-001') // Should be padded to 10 chars: '  PROD-001'
  })

  it('has avatar section structure', () => {
    const wrapper = mountComponent(mockProduct)

    const section = wrapper.findComponent({ name: 'QItemSection' })
    expect(section.exists()).toBe(true)
    expect(section.props('avatar')).toBe(true)
  })
})
