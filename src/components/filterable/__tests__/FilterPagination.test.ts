import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FilterPagination from '../FilterPagination.vue'

const mountComponent = (props = {}) => {
  return mount(FilterPagination, {
    props: {
      max: 5,
      ...props
    }
  })
}

describe('FilterPagination.vue', () => {
  it('renders pagination with correct max prop', () => {
    const wrapper = mountComponent({ max: 10 })

    const pagination = wrapper.findComponent({ name: 'QPagination' })
    expect(pagination.exists()).toBe(true)
    expect(pagination.props('max')).toBe(10)
    expect(pagination.props('maxPages')).toBe(5)
    expect(pagination.props('boundaryNumbers')).toBe(true)
    expect(pagination.props('boundaryLinks')).toBe(true)
    expect(pagination.props('directionLinks')).toBe(true)
  })

  it('has correct CSS classes', () => {
    const wrapper = mountComponent({ max: 5 })

    const pagination = wrapper.findComponent({ name: 'QPagination' })
    expect(pagination.classes()).toContain('q-mt-md')
    expect(pagination.classes()).toContain('col-auto')
  })

  it('has correct container structure', () => {
    const wrapper = mountComponent({ max: 3 })

    const container = wrapper.find('.row.justify-center')
    expect(container.exists()).toBe(true)

    const pagination = container.findComponent({ name: 'QPagination' })
    expect(pagination.exists()).toBe(true)
  })

  it('defaults to page 1 when no model value provided', () => {
    const wrapper = mountComponent({ max: 5 })

    const pagination = wrapper.findComponent({ name: 'QPagination' })
    expect(pagination.props('modelValue')).toBe(1)
  })

  it('accepts and updates model value', async () => {
    const wrapper = mountComponent({ max: 5, modelValue: 3 })

    const pagination = wrapper.findComponent({ name: 'QPagination' })
    expect(pagination.props('modelValue')).toBe(3)

    // Simulate changing the page
    await wrapper.setProps({ modelValue: 4 })
    expect(pagination.props('modelValue')).toBe(4)
  })

  it('emits update:modelValue when pagination changes', async () => {
    const wrapper = mountComponent({ max: 5, modelValue: 1 })

    const pagination = wrapper.findComponent({ name: 'QPagination' })

    // Simulate pagination change
    await pagination.vm.$emit('update:modelValue', 3)

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })
})
