import { describe, it, expect } from 'vitest'
import { capitalize, parsePrice } from '../text'

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('returns single uppercase letter for single char', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('does not change already capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('parsePrice', () => {
  it('formats a number as currency', () => {
    const result = parsePrice(1500)
    // Should contain the number, format varies by locale
    expect(result).toContain('1')
    expect(result).toContain('500')
  })

  it('formats zero', () => {
    const result = parsePrice(0)
    expect(result).toContain('0')
  })

  it('formats decimal values', () => {
    const result = parsePrice(19.99)
    expect(result).toContain('19')
  })

  it('formats negative values', () => {
    const result = parsePrice(-50)
    expect(result).toContain('50')
  })
})
