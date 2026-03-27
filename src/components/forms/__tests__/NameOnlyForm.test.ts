import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import NameOnlyForm from '../NameOnlyForm.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key)
  }))
}))

describe('NameOnlyForm.vue', () => {
  it('renders q-input for name', () => {
    const wrapper = mount(NameOnlyForm)
    expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
  })

  it('binds v-model correctly for name', async () => {
    const wrapper = mount(NameOnlyForm)
    const vm = wrapper.vm as any
    vm.name = 'Test Name'
    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Test Name'])
  })

  it('sets the correct label for name input', () => {
    const wrapper = mount(NameOnlyForm)
    const input = wrapper.findComponent({ name: 'QInput' })
    expect(input.props('label')).toBe('common.name')
  })
})
