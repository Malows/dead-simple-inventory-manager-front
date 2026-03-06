import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HomeItem from '../HomeItem.vue'

import { mockFullProduct, mockLowStockProduct, mockNoStockProduct } from '../../__tests__/mocks'

const mountComponent = (props = {}) => {
  return mount(HomeItem, {
    props: { product: mockFullProduct, ...props }
  })
}

describe('HomeItem.vue', () => {
  it('renders as a clickable QItem', () => {
    const wrapper = mountComponent()

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.exists()).toBe(true)
    expect(item.props('clickable')).toBe(true)
  })

  it('shows positive icon when stock is above warning threshold', () => {
    const wrapper = mountComponent()

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('color')).toBe('positive')
  })

  it('shows warning icon when stock is low but above zero', () => {
    const wrapper = mountComponent({ product: mockLowStockProduct })

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('color')).toBe('warning')
  })

  it('shows negative icon when stock is zero', () => {
    const wrapper = mountComponent({ product: mockNoStockProduct })

    const icon = wrapper.findComponent({ name: 'QIcon' })
    expect(icon.props('color')).toBe('negative')
  })

  it('is not selected by default', () => {
    const wrapper = mountComponent()

    const item = wrapper.findComponent({ name: 'QItem' })
    expect(item.classes()).not.toContain('bg-primary')
  })

  it('adds bg-primary class when product is selected', () => {
    const wrapper = mountComponent({ 'onUpdate:selected': () => {} })
    wrapper.setProps({ selected: mockFullProduct })

    return wrapper.vm.$nextTick().then(() => {
      const item = wrapper.findComponent({ name: 'QItem' })
      expect(item.classes()).toContain('bg-primary')
    })
  })

  it('emits update:selected with the product when clicked while unselected', async () => {
    const wrapper = mountComponent()

    await wrapper.findComponent({ name: 'QItem' }).trigger('click')

    expect(wrapper.emitted('update:selected')).toBeTruthy()
    expect(wrapper.emitted('update:selected')![0]).toEqual([mockFullProduct])
  })

  it('emits update:selected with null when clicked while already selected', async () => {
    const wrapper = mountComponent({ selected: mockFullProduct })

    await wrapper.findComponent({ name: 'QItem' }).trigger('click')

    expect(wrapper.emitted('update:selected')![0]).toEqual([null])
  })
})
