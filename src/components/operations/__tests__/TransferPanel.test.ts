import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TransferPanel from '../../operations/TransferPanel.vue'
import { mockProduct } from '../../__tests__/mocks'

const mountComponent = (props = {}) => {
  return mount(TransferPanel, {
    props: {
      title: 'Selected',
      totalCount: 1,
      items: [mockProduct],
      checkedItems: new Set<string>(),
      checkedCount: 0,
      allChecked: false,
      indeterminate: false,
      page: 1,
      totalPages: 1,
      showQuantities: true,
      quantities: { [mockProduct.uuid]: 0 },
      ...props
    }
  })
}

describe('TransferPanel.vue', () => {
  it('sets sale max to current stock', () => {
    const wrapper = mountComponent({ movementType: 'sale' })
    const input = wrapper.find('input[type="number"]')

    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe(String(mockProduct.stock))
    expect(wrapper.text()).toContain('Sold units')
  })

  it('does not set max for purchase', () => {
    const wrapper = mountComponent({ movementType: 'purchase' })
    const input = wrapper.find('input[type="number"]')

    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBeUndefined()
    expect(wrapper.text()).toContain('Purchased units')
  })

  it('does not set max for return', () => {
    const wrapper = mountComponent({ movementType: 'return' })
    const input = wrapper.find('input[type="number"]')

    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBeUndefined()
    expect(wrapper.text()).toContain('Returned units')
  })

  it('does not set max for adjustment and uses adjusted label', () => {
    const wrapper = mountComponent({ movementType: 'adjustment' })
    const input = wrapper.find('input[type="number"]')

    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBeUndefined()
    expect(wrapper.text()).toContain('Adjusted stock')
  })
})
