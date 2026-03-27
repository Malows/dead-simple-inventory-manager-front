import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import StorageLocationItem from '../StorageLocationItem.vue'

import { mockStorageLocation, mockStorageLocationNoProducts } from '../../../__tests__/mocks'

describe('StorageLocationItem.vue', () => {
  it('renders storage location name correctly', () => {
    const wrapper = mount(StorageLocationItem, {
      props: { storageLocation: mockStorageLocation }
    })

    expect(wrapper.text()).toContain('Main Warehouse')
  })

  it('displays product count correctly', () => {
    const wrapper = mount(StorageLocationItem, {
      props: { storageLocation: mockStorageLocation }
    })

    expect(wrapper.text()).toContain('3 products')
  })

  it('displays zero products for empty storage location', () => {
    const wrapper = mount(StorageLocationItem, {
      props: { storageLocation: mockStorageLocationNoProducts }
    })

    expect(wrapper.text()).toContain('no products')
  })

  it('has clickable item with correct route', () => {
    const wrapper = mount(StorageLocationItem, {
      props: { storageLocation: mockStorageLocation }
    })

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.exists()).toBe(true)
    expect(item.props('clickable')).toBe(true)
    expect(item.props('to')).toEqual({
      name: 'storage locations show',
      params: { storageLocationId: 'storage-location-uuid-123' }
    })
  })

  it('displays storage location description', () => {
    const wrapper = mount(StorageLocationItem, {
      props: { storageLocation: mockStorageLocation }
    })

    expect(wrapper.text()).toContain('Primary location')
  })
})
