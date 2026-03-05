import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FilterableSelect from '../FilterableSelect.vue'
import type { SelectOption } from '../../../types/index'

const options: SelectOption<number>[] = [
  { label: 'Apple', value: 1 },
  { label: 'Banana', value: 2 },
  { label: 'Cherry', value: 3 },
  { label: 'Blueberry', value: 4 }
]

const mountComponent = (props = {}) => {
  return mount(FilterableSelect, {
    props: { label: 'Fruit', options, ...props }
  })
}

describe('FilterableSelect.vue', () => {
  it('renders QSelect component', () => {
    const wrapper = mountComponent()

    const select = wrapper.findComponent({ name: 'QSelect' })
    expect(select.exists()).toBe(true)
  })

  it('passes the label to QSelect', () => {
    const wrapper = mountComponent()

    const select = wrapper.findComponent({ name: 'QSelect' })
    expect(select.props('label')).toBe('Fruit')
  })

  it('shows all options initially', () => {
    const wrapper = mountComponent()

    const select = wrapper.findComponent({ name: 'QSelect' })
    expect(select.props('options')).toHaveLength(4)
  })

  it('accepts modelValue prop', () => {
    const wrapper = mountComponent({ modelValue: 2 })

    const select = wrapper.findComponent({ name: 'QSelect' })
    expect(select.props('modelValue')).toBe(2)
  })

  it('emits update:modelValue on selection', async () => {
    const wrapper = mountComponent()

    const select = wrapper.findComponent({ name: 'QSelect' })
    await select.vm.$emit('update:modelValue', 3)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
  })

  it('QSelect has clearable and use-input props', () => {
    const wrapper = mountComponent()

    const select = wrapper.findComponent({ name: 'QSelect' })
    expect(select.props('clearable')).toBe(true)
    expect(select.props('useInput')).toBe(true)
  })

  it('filters options matching the search term', async () => {
    const wrapper = mountComponent()

    const select = wrapper.findComponent({ name: 'QSelect' })

    let capturedOptions: SelectOption<number>[] = []
    // Simulate the filter event by invoking the callback directly
    await select.vm.$emit('filter', 'ber', (fn: () => void) => fn())

    await wrapper.vm.$nextTick()

    // After filtering for 'ber', only 'Blueberry' matches
    capturedOptions = (wrapper.findComponent({ name: 'QSelect' }).props('options') as SelectOption<number>[])
    expect(capturedOptions).toHaveLength(1)
    expect(capturedOptions[0].label).toBe('Blueberry')
  })

  it('restores all options when filter is aborted', async () => {
    const wrapper = mountComponent()
    const select = wrapper.findComponent({ name: 'QSelect' })

    // First apply a filter
    await select.vm.$emit('filter', 'ban', (fn: () => void) => fn())
    await wrapper.vm.$nextTick()
    expect(select.props('options')).toHaveLength(1)

    // Then abort
    await select.vm.$emit('filter-abort')
    await wrapper.vm.$nextTick()
    expect(select.props('options')).toHaveLength(4)
  })
})
