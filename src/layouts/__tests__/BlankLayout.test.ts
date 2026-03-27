import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlankLayout from '../BlankLayout.vue'

describe('BlankLayout.vue', () => {
  it('renders', () => {
    const wrapper = mount(BlankLayout, {
      global: {
        stubs: ['router-view']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
