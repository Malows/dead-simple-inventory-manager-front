import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SupplierItem from '../SupplierItem.vue'

import { mockSupplier, mockSupplierNoProducts } from './mocks'

describe('SupplierItem.vue', () => {
  it('renders supplier name correctly', () => {
    const wrapper = mount(SupplierItem, {
      props: { supplier: mockSupplier }
    })

    expect(wrapper.text()).toContain('Test Supplier')
  })

  it('displays product count correctly', () => {
    const wrapper = mount(SupplierItem, {
      props: { supplier: mockSupplier }
    })

    expect(wrapper.text()).toContain('3 products')
  })

  it('displays zero products for supplier with no products', () => {
    const wrapper = mount(SupplierItem, {
      props: { supplier: mockSupplierNoProducts }
    })

    expect(wrapper.text()).toContain('no products')
  })

  it('has clickable item with correct route', () => {
    const wrapper = mount(SupplierItem, {
      props: { supplier: mockSupplier }
    })

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.exists()).toBe(true)
    expect(item.props('clickable')).toBe(true)
    expect(item.props('to')).toEqual({
      name: 'suppliers show',
      params: { supplierId: 'supplier-uuid-123' }
    })
  })

  it('has QItemLabel for name and caption', () => {
    const wrapper = mount(SupplierItem, {
      props: { supplier: mockSupplier }
    })

    const labels = wrapper.findAllComponents({ name: 'QItemLabel' })
    expect(labels.length).toBeGreaterThanOrEqual(2)
  })
})
