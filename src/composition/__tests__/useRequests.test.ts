import { describe, expect, it } from 'vitest'

import { useRequests } from '../useRequests'

describe('useRequests', () => {
  it('should update requestStatus correctly during a request', async () => {
    const { requestStatus, request } = useRequests()

    // Initial state should be idle
    expect(requestStatus.value).toEqual({ idle: true, fetching: false })

    // Create a mock promise that resolves after a short delay
    const mockPromise = new Promise((resolve) => setTimeout(() => resolve('response'), 100))

    // Start the request
    const responsePromise = request(mockPromise)

    // After starting the request, it should be fetching
    expect(requestStatus.value).toEqual({ idle: false, fetching: true })

    // Wait for the response to resolve
    const response = await responsePromise

    // After the request completes, it should not be fetching
    expect(requestStatus.value).toEqual({ idle: false, fetching: false })
    expect(response).toBe('response')
  })
})
