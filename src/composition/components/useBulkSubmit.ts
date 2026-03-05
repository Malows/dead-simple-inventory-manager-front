import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'

export function useBulkSubmit () {
  const quasar = useQuasar()
  const { t } = useI18n()
  const productsStore = useProductsStore()

  async function execute (
    action: () => Promise<{ isOk?: boolean }>,
    successKey: string,
    errorKey: string,
    onSuccess?: () => void
  ) {
    quasar.loading.show()

    try {
      const response = await action()

      if (response?.isOk) {
        quasar.notify({ color: 'positive', message: t(successKey) })
        onSuccess?.()
        await productsStore.forceGetProducts()
      } else {
        quasar.notify({ color: 'negative', message: t(errorKey) })
      }
    } catch {
      quasar.notify({ color: 'negative', message: t(errorKey) })
    } finally {
      quasar.loading.hide()
    }
  }

  return { execute }
}
