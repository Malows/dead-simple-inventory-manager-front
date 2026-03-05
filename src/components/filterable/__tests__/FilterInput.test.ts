import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FilterInput from '../FilterInput.vue'

const mountComponent = (modelValue: string) => {
  return mount(FilterInput, {
    props: { modelValue }
  })
}

describe('FilterInput.vue', () => {
  it('renders input with correct model value', () => {
    const wrapper = mountComponent('test')

    const input = wrapper.findComponent({ name: 'QInput' })
    expect(input.exists()).toBe(true)
    expect(input.props('modelValue')).toBe('test')
  })

  it('has correct CSS classes', () => {
    const wrapper = mountComponent('test')

    const input = wrapper.findComponent({ name: 'QInput' })
    expect(input.classes()).toContain('q-my-md')
  })

  it('has correct container structure', () => {
    const wrapper = mountComponent('test')

    const input = wrapper.findComponent({ name: 'QInput' })
    expect(input.exists()).toBe(true)
  })

  it('defaults to empty string when no model value provided', () => {
    const wrapper = mount(FilterInput)

    const input = wrapper.findComponent({ name: 'QInput' })
    expect(input.props('modelValue')).toBe('')
  })

  it('accepts and updates model value', async () => {
    const wrapper = mountComponent('test')

    const input = wrapper.findComponent({ name: 'QInput' })
    expect(input.props('modelValue')).toBe('test')

    // Simulate changing the page
    await wrapper.setProps({ modelValue: 'new value' })
    expect(input.props('modelValue')).toBe('new value')
  })

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mountComponent('test')

    const input = wrapper.findComponent({ name: 'QInput' })

    // Simulate input change
    await input.vm.$emit('update:modelValue', 'new value')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toEqual([['new value']])
  })
})
