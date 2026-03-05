import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import InlineData from 'components/InlineData.vue'

describe('InlineData.vue', () => {
  it('renders label prop correctly', () => {
    const wrapper = mount(InlineData, {
      props: {
        label: 'Test Label'
      }
    })

    expect(wrapper.text()).toContain('Test Label:')
  })

  it('renders slot content', () => {
    const wrapper = mount(InlineData, {
      props: {
        label: 'Test Label'
      },
      slots: {
        default: 'Test Content'
      }
    })

    expect(wrapper.text()).toContain('Test Label:')
    expect(wrapper.text()).toContain('Test Content')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(InlineData, {
      props: {
        label: 'Test'
      }
    })

    expect(wrapper.classes()).toContain('text-body1')
    const strong = wrapper.find('strong')
    expect(strong.exists()).toBe(true)
  })
})
