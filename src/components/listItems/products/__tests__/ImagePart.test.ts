import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Product } from '../../../../types/product.interfaces'

import ImagePart from '../ImagePart.vue'

// Import mocks
import { mockProduct, mockProductNoImage } from './mocks'

const mountComponent = (product: Product) => {
  return mount(ImagePart, {
    props: { product }
  })
}

describe('ImagePart.vue', () => {
  it('renders avatar with image when product has image_url', () => {
    const wrapper = mountComponent(mockProduct)

    const section = wrapper.findComponent({ name: 'QItemSection' })
    expect(section.exists()).toBe(true)
    expect(section.props('avatar')).toBe(true)

    const avatar = wrapper.findComponent({ name: 'QAvatar' })
    expect(avatar.exists()).toBe(true)
    expect(avatar.props('size')).toBe('64px')

    const img = wrapper.findComponent({ name: 'QImg' })
    expect(img.exists()).toBe(true)
    expect(img.props('src')).toBe('https://example.com/image.jpg')
    expect(img.props('fit')).toBe('cover')
    expect(img.props('loading')).toBe('lazy')
  })

  it('does not render avatar when product has no image_url', () => {
    const wrapper = mountComponent(mockProductNoImage)

    const avatar = wrapper.findComponent({ name: 'QAvatar' })
    expect(avatar.exists()).toBe(false)

    const img = wrapper.findComponent({ name: 'QImg' })
    expect(img.exists()).toBe(false)
  })

  it('applies custom size correctly', () => {
    const wrapper = mount(ImagePart, {
      props: { product: mockProduct, size: '32px' }
    })

    const avatar = wrapper.findComponent({ name: 'QAvatar' })
    expect(avatar.props('size')).toBe('32px')
  })

  it('uses default size when no size provided', () => {
    const wrapper = mountComponent(mockProduct)

    const avatar = wrapper.findComponent({ name: 'QAvatar' })
    expect(avatar.props('size')).toBe('64px')
  })
})
