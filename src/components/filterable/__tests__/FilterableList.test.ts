import { describe, it, expect, vi } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'

import FilterableList from '../FilterableList.vue'

const items = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Cherry' },
  { name: 'Date' },
  { name: 'Elderberry' }
]

const mountComponent = (props = {}) => {
  return mount(FilterableList, {
    props: { items, ...props },
    slots: {
      // @ts-expect-error - We are providing a custom slot for testing purposes
      default: (slotProps: { item: { name: string } }) =>
        h('div', { class: 'test-item' }, slotProps.item.name)
    }
  })
}

describe('FilterableList.vue', () => {
  it('renders slot for each item on first page', () => {
    const wrapper = mountComponent()

    const rendered = wrapper.findAll('.test-item')
    expect(rendered.length).toBe(5)
  })

  it('filters items by search', async () => {
    const wrapper = mountComponent()

    const input = wrapper.findComponent({ name: 'FilterInput' })
    await input.vm.$emit('update:modelValue', 'berry')
    await wrapper.vm.$nextTick()

    const rendered = wrapper.findAll('.test-item')
    expect(rendered.length).toBe(1)
    expect(rendered[0].text()).toBe('Elderberry')
  })

  it('resets to page 1 when search changes', async () => {
    const wrapper = mountComponent({ itemsPerPage: 2 })

    // Go to page 2
    const pagination = wrapper.findComponent({ name: 'FilterPagination' })
    await pagination.vm.$emit('update:modelValue', 2)
    await wrapper.vm.$nextTick()
    expect(pagination.props('modelValue')).toBe(2)

    // Change search should reset page
    const input = wrapper.findComponent({ name: 'FilterInput' })
    await input.vm.$emit('update:modelValue', 'a')
    await wrapper.vm.$nextTick()

    expect(pagination.props('modelValue')).toBe(1)
  })

  it('emits changeSearch when search value changes', async () => {
    const wrapper = mountComponent()

    const input = wrapper.findComponent({ name: 'FilterInput' })
    await input.vm.$emit('update:modelValue', 'ban')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('changeSearch')).toBeTruthy()
    expect(wrapper.emitted('changeSearch')![0]).toEqual(['ban'])
  })

  it('paginates items when itemsPerPage is set', () => {
    const wrapper = mountComponent({ itemsPerPage: 2 })

    const rendered = wrapper.findAll('.test-item')
    expect(rendered.length).toBe(2)

    const pagination = wrapper.findComponent({ name: 'FilterPagination' })
    expect(pagination.props('max')).toBe(3)
  })

  it('uses custom filterFn when provided', async () => {
    const filterFn = vi.fn(() => (item: { name: string }) => item.name === 'Cherry')
    const wrapper = mountComponent({ filterFn })

    const input = wrapper.findComponent({ name: 'FilterInput' })
    await input.vm.$emit('update:modelValue', 'x')
    await wrapper.vm.$nextTick()

    expect(filterFn).toHaveBeenCalledWith('x')
    const rendered = wrapper.findAll('.test-item')
    expect(rendered.length).toBe(1)
    expect(rendered[0].text()).toBe('Cherry')
  })

  it('renders empty list when no items match filter', async () => {
    const wrapper = mountComponent()

    const input = wrapper.findComponent({ name: 'FilterInput' })
    await input.vm.$emit('update:modelValue', 'zzz')
    await wrapper.vm.$nextTick()

    const rendered = wrapper.findAll('.test-item')
    expect(rendered.length).toBe(0)
  })

  it('renders FilterInput and FilterPagination', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'FilterInput' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FilterPagination' }).exists()).toBe(true)
  })
})
