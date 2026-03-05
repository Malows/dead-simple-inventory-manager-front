import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ProductList from '../ProductList.vue'
import { mockProducts } from './mocks'

describe('ProductList.vue', () => {
  it('renders a q-list', () => {
    const wrapper = mount(ProductList, { props: { products: mockProducts } })

    expect(wrapper.findComponent({ name: 'QList' }).exists()).toBe(true)
  })

  it('renders product-item for each product', () => {
    const wrapper = mount(ProductList, { props: { products: mockProducts } })

    const items = wrapper.findAllComponents({ name: 'ProductItem' })
    expect(items.length).toBe(mockProducts.length)
  })

  it('passes product prop to each product-item', () => {
    const wrapper = mount(ProductList, { props: { products: mockProducts } })

    const items = wrapper.findAllComponents({ name: 'ProductItem' })
    expect(items[0].props('product')).toEqual(mockProducts[0])
    expect(items[1].props('product')).toEqual(mockProducts[1])
  })

  it('renders empty list when no products', () => {
    const wrapper = mount(ProductList, { props: { products: [] } })

    const items = wrapper.findAllComponents({ name: 'ProductItem' })
    expect(items.length).toBe(0)
  })
})
