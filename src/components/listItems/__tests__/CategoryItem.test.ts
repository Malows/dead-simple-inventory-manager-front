import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CategoryItem from '../CategoryItem.vue'

import { mockCategory, mockCategoryNoProducts } from './mocks'

describe('CategoryItem.vue', () => {
  it('renders category name correctly', () => {
    const wrapper = mount(CategoryItem, {
      props: { category: mockCategory }
    })

    expect(wrapper.text()).toContain('Test Category')
  })

  it('displays product count correctly', () => {
    const wrapper = mount(CategoryItem, {
      props: { category: mockCategory }
    })

    expect(wrapper.text()).toContain('3 products')
  })

  it('displays zero products for empty category', () => {
    const wrapper = mount(CategoryItem, {
      props: { category: mockCategoryNoProducts }
    })

    expect(wrapper.text()).toContain('no products')
  })

  it('has clickable item with correct route', () => {
    const wrapper = mount(CategoryItem, {
      props: { category: mockCategory }
    })

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.exists()).toBe(true)
    expect(item.props('clickable')).toBe(true)
    expect(item.props('to')).toEqual({
      name: 'categories show',
      params: { categoryId: 'category-uuid-123' }
    })
  })
})
