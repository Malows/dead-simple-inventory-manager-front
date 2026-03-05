import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SelectableCard from '../SelectableCard.vue'

describe('SelectableCard.vue', () => {
  const props = {
    title: 'Test Title',
    description: 'Test Description',
    icon: 'test_icon',
    color: 'primary',
    action: 'Select',
    value: 'test-value'
  }

  it('renders the card with correct content', () => {
    const wrapper = mount(SelectableCard, { props })

    expect(wrapper.text()).toContain(props.title)
    expect(wrapper.text()).toContain(props.description)
    expect(wrapper.find('.q-badge').text()).toBe(props.action)
  })

  it('renders the icon with correct props', () => {
    const wrapper = mount(SelectableCard, { props })

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('name')).toBe(props.icon)
    expect(icon.props('color')).toBe(props.color)
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(SelectableCard, { props })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([props.value])
  })

  it('shows check icon when selected', () => {
    const wrapper = mount(SelectableCard, { props: { ...props, modelValue: props.value } })

    expect(wrapper.findAllComponents({ name: 'QIcon' }).length).toBe(2)
  })

  it('does not show check icon when not selected', () => {
    const wrapper = mount(SelectableCard, { props: { ...props, modelValue: 'other-value' } })

    expect(wrapper.findAllComponents({ name: 'QIcon' }).length).toBe(1)
  })

  it('applies selected class when model matches value', () => {
    const wrapper = mount(SelectableCard, { props: { ...props, modelValue: props.value } })

    expect(wrapper.classes()).toContain('selection-card--selected')
  })

  it('does not apply selected class when model does not match value', () => {
    const wrapper = mount(SelectableCard, { props: { ...props, modelValue: 'other-value' } })

    expect(wrapper.classes()).not.toContain('selection-card--selected')
  })
})
