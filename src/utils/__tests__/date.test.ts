import { describe, it, expect } from 'vitest'
import { toPlainString, fromPlainString, filterDate } from '../date'

describe('toPlainString', () => {
  it('formats a Date object to dd/MM/yyyy', () => {
    const date = new Date(2024, 0, 15) // Jan 15, 2024
    expect(toPlainString(date)).toBe('15/01/2024')
  })

  it('formats an ISO string to dd/MM/yyyy', () => {
    expect(toPlainString('2024-06-20T10:30:00.000Z')).toMatch(/20\/06\/2024/)
  })

  it('returns empty string for falsy input', () => {
    expect(toPlainString('')).toBe('')
  })
})

describe('fromPlainString', () => {
  it('parses dd/MM/yyyy string to Date', () => {
    const result = fromPlainString('15/01/2024')
    expect(result).toBeInstanceOf(Date)
    expect(result!.getFullYear()).toBe(2024)
    expect(result!.getMonth()).toBe(0)
    expect(result!.getDate()).toBe(15)
  })

  it('returns null for empty string', () => {
    expect(fromPlainString('')).toBeNull()
  })
})

describe('filterDate', () => {
  it('parses valid dd/MM/yyyy format', () => {
    const result = filterDate('15/01/2024')
    expect(result).toBeInstanceOf(Date)
    expect(result!.getFullYear()).toBe(2024)
  })

  it('parses with any separator between digits', () => {
    const result = filterDate('15.01.2024')
    expect(result).toBeInstanceOf(Date)
  })

  it('returns null for invalid format', () => {
    expect(filterDate('not-a-date')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(filterDate('')).toBeNull()
  })
})
