import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ToggleGrid from '../ToggleGrid.vue'

const mockOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Another C', value: 'c' }
]

describe('ToggleGrid.vue', () => {
  it('renders label when provided', () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions,
        label: 'Test Label'
      }
    })

    expect(wrapper.text()).toContain('Test Label:')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    expect(wrapper.text()).not.toContain(':')
  })

  it('renders all options when no filter', () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    const toggles = wrapper.findAllComponents({ name: 'QToggle' })
    expect(toggles).toHaveLength(3)
  })

  it('filters options based on search input', async () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    const searchInput = wrapper.findComponent({ name: 'QInput' })
    await searchInput.vm.$emit('update:modelValue', 'Option')

    const toggles = wrapper.findAllComponents({ name: 'QToggle' })
    expect(toggles).toHaveLength(2) // Option A and Option B
  })

  it('filters options case-insensitively', async () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    const searchInput = wrapper.findComponent({ name: 'QInput' })
    await searchInput.vm.$emit('update:modelValue', 'another')

    const toggles = wrapper.findAllComponents({ name: 'QToggle' })
    expect(toggles).toHaveLength(1) // Another C
  })

  it('shows all options when filter is cleared', async () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    const searchInput = wrapper.findComponent({ name: 'QInput' })
    await searchInput.vm.$emit('update:modelValue', 'Option')
    await searchInput.vm.$emit('update:modelValue', '')

    const toggles = wrapper.findAllComponents({ name: 'QToggle' })
    expect(toggles).toHaveLength(3)
  })

  it('emits update:modelValue when toggles are changed', async () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    const toggles = wrapper.findAllComponents({ name: 'QToggle' })
    await toggles[0].vm.$emit('update:modelValue', ['a'])

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a']])
  })

  it('accepts initial model value', () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions,
        modelValue: ['a', 'c']
      }
    })
    const vm = wrapper.vm as any

    expect(vm.model).toEqual(['a', 'c'])
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(ToggleGrid, {
      props: {
        options: mockOptions
      }
    })

    expect(wrapper.find('.common-grid').exists()).toBe(true)
  })
})
