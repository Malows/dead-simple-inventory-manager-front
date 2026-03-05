import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import StockControls from '../StockControls.vue'

describe('StockControls.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(StockControls, {
      props: {
        brandsOptions: [
          { label: 'Brand 1', value: 1 },
          { label: 'Brand 2', value: 2 }
        ],
        suppliersOptions: [
          { label: 'Supplier 1', value: 1 },
          { label: 'Supplier 2', value: 2 }
        ],
        categoriesOptions: [
          { label: 'Category 1', value: 1 },
          { label: 'Category 2', value: 2 }
        ],
        ...props
      },
      global: {
        stubs: {
          FilterInput: true,
          FilterableSelect: true
        }
      }
    })
  }

  it('renders FilterInput and FilterableSelect components', () => {
    const wrapper = mountComponent()
    expect(wrapper.findComponent({ name: 'FilterInput' }).exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'FilterableSelect' })).toHaveLength(3)
  })

  it('binds search model', async () => {
    const wrapper = mountComponent()
    const filterInput = wrapper.findComponent({ name: 'FilterInput' })
    await filterInput.vm.$emit('update:modelValue', 'test search')
    expect(wrapper.emitted('update:search')).toBeTruthy()
    expect(wrapper.emitted('update:search')![0]).toEqual(['test search'])
  })

  it('binds brand model', async () => {
    const wrapper = mountComponent()
    const selects = wrapper.findAllComponents({ name: 'FilterableSelect' })
    const brandSelect = selects[0] // First one is brand
    await brandSelect.vm.$emit('update:modelValue', 1)
    expect(wrapper.emitted('update:brand')).toBeTruthy()
    expect(wrapper.emitted('update:brand')![0]).toEqual([1])
  })

  it('binds supplier model', async () => {
    const wrapper = mountComponent()
    const selects = wrapper.findAllComponents({ name: 'FilterableSelect' })
    const supplierSelect = selects[1] // Second one is supplier
    await supplierSelect.vm.$emit('update:modelValue', 2)
    expect(wrapper.emitted('update:supplier')).toBeTruthy()
    expect(wrapper.emitted('update:supplier')![0]).toEqual([2])
  })

  it('binds category model', async () => {
    const wrapper = mountComponent()
    const selects = wrapper.findAllComponents({ name: 'FilterableSelect' })
    const categorySelect = selects[2] // Third one is category
    await categorySelect.vm.$emit('update:modelValue', 1)
    expect(wrapper.emitted('update:category')).toBeTruthy()
    expect(wrapper.emitted('update:category')![0]).toEqual([1])
  })
})
