import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ErrorNotFound from '../ErrorNotFound.vue'

describe('ErrorNotFound.vue', () => {
  it('renders 404 and not found message', () => {
    const wrapper = mount(ErrorNotFound)
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Oops. Nothing here...')
  })

  it('has go home button with correct props', () => {
    const wrapper = mount(ErrorNotFound)
    const button = wrapper.findComponent({ name: 'QBtn' })
    expect(button.props('to')).toBe('/')
    expect(button.props('label')).toBe('Go Home')
  })
})
