import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRouter, RouteLocationRaw } from 'vue-router'

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

export function useErrorRequest () {
  const { t } = useI18n()
  const $q = useQuasar()
  const router = useRouter()

  const errorNotify = (message: string | number, route?: RouteLocationRaw) => (error: Error) => {
    console.error(error)
    $q.notify({
      color: 'negative',
      message: t(message)
    })
    if (route) {
      router.push(route)
    }
  }

  return { errorNotify }
}
