import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import StorageLocationForm from '../StorageLocationForm.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key)
  }))
}))

describe('StorageLocationForm.vue', () => {
  it('renders two q-input components', () => {
    const wrapper = mount(StorageLocationForm)
    expect(wrapper.findAllComponents({ name: 'QInput' })).toHaveLength(2)
  })

  it('binds v-model for name', async () => {
    const wrapper = mount(StorageLocationForm)
    const vm = wrapper.vm as any
    vm.name = 'Test Location'
    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Test Location'])
  })

  it('binds v-model for description', async () => {
    const wrapper = mount(StorageLocationForm)
    const vm = wrapper.vm as any
    vm.description = 'A description'
    expect(wrapper.emitted('update:description')?.[0]).toEqual(['A description'])
  })

  it('name input has correct label', () => {
    const wrapper = mount(StorageLocationForm)
    const inputs = wrapper.findAllComponents({ name: 'QInput' })
    expect(inputs[0].props('label')).toBe('common.name')
  })

  it('description input has correct label', () => {
    const wrapper = mount(StorageLocationForm)
    const inputs = wrapper.findAllComponents({ name: 'QInput' })
    expect(inputs[1].props('label')).toBe('storage_locations.Description')
  })
})
