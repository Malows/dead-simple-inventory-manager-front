import { ref } from 'vue'

export function useRequests () {
  const requestStatus = ref({ idle: true, fetching: false })

  async function request<T> (promise: Promise<T>) {
    requestStatus.value = { idle: false, fetching: true }
    const response = await promise
    requestStatus.value = { idle: false, fetching: false }

    return response
  }

  return { requestStatus, request }
}
