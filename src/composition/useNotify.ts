import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRouter, RouteLocationRaw } from 'vue-router'
import HttpResponse from '../services/Response'

export function useNotify () {
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

  const goodNotify = (message: string | number, route?: RouteLocationRaw) => <T>(httpResponse: HttpResponse<T>) => {
    if (!httpResponse.isOk) throw httpResponse.error

    $q.notify({
      color: 'positive',
      message: t(message)
    })
    if (route) {
      router.push(route)
    }
  }

  return {
    errorNotify,
    goodNotify
  }
}
