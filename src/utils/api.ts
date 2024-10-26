import { QVueGlobals } from 'quasar'
import HttpResponse from 'src/services/Response'
import { DispatchOptions } from 'vuex'

interface HttpError {
  data: {
    message: string,
    errors?: Record<string, string[]>
  }
}

/**
 *
 * @param {*} response
 * @returns
 */
function fromServerError (response: HttpError) {
  return {
    timeout: 5000,
    message: response.data.message
  }
}

/**
 *
 * @param {*} response
 * @returns
 */
function fromValidationError (response: HttpError) {
  const errors = Object.values(response.data.errors ?? {}).flat(2)

  const messages: string = errors.join('\n\n')

  const errorsPoints: number = errors.length

  return {
    timeout: 3000 * (errorsPoints + 1),
    message: `${response.data.message} ${messages}`
  }
}

/**
 *
 * @param {*} store
 * @param {*} quasar
 * @param {*} action
 * @param {*} payload
 * @returns
 */
export async function task<T = any> (store: Store, quasar: QVueGlobals, action: string, payload: DispatchOptions) {
  quasar.loading.show()
  const response: HttpResponse<T> = await store.dispatch(action, payload)
  quasar.loading.hide()

  if (!response.isOk) {
    const data = response.code === 422
      ? fromValidationError(response)
      : fromServerError(response)

    quasar.notify({
      color: 'negative',
      ...data
    })
  }
  return response
}

/**
 *
 * @param {*} store
 * @param {*} quasar
 * @param {*} action
 * @param {*} payload
 * @returns
 */
export async function pull<T = any> (
  store: Store,
  quasar: QVueGlobals,
  action: string,
  payload?: DispatchOptions
): Promise<HttpResponse<T>> {
  quasar.loading.show()

  const response = payload
    ? await store.dispatch(action, payload)
    : await store.dispatch(action)

  quasar.loading.hide()

  return response
}
/**
 *
 * @param {*} store
 * @param {*} quasar
 * @param {*} actions
 * @returns
 */
export async function pullMany (
  store: Store,
  quasar: QVueGlobals,
  actions: [string, DispatchOptions?][]
): Promise<HttpResponse<any>[]> {
  quasar.loading.show()

  return Promise.all(
    actions.map(x => store.dispatch(...x))
  ).finally(() => {
    quasar.loading.hide()
  })
}
