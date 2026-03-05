import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useBrandsStore } from '../../stores/brands'
import { useCategoriesStore } from '../../stores/categories'
import { useSuppliersStore } from '../../stores/suppliers'
import type { PriceEntityType } from '../../types/operations.interfaces'
import type { SelectOption } from '../../types'

export function useEntitySelection () {
  const { t } = useI18n()
  const brandsStore = useBrandsStore()
  const categoriesStore = useCategoriesStore()
  const suppliersStore = useSuppliersStore()

  const entityType = ref<PriceEntityType | null>(null)
  const entityUuid = ref<string | null>(null)

  const entityTypeOptions = computed(() => [
    { label: t('operations.by_brand'), value: 'brand' as PriceEntityType },
    { label: t('operations.by_supplier'), value: 'supplier' as PriceEntityType },
    { label: t('operations.by_category'), value: 'category' as PriceEntityType }
  ])

  const entityOptions = computed<SelectOption<string>[]>(() => {
    switch (entityType.value) {
      case 'brand':
        return brandsStore.brands.map((b) => ({ label: b.name, value: b.uuid }))
      case 'supplier':
        return suppliersStore.suppliers.map((s) => ({ label: s.name, value: s.uuid }))
      case 'category':
        return categoriesStore.categories.map((c) => ({ label: c.name, value: c.uuid }))
      default:
        return []
    }
  })

  watch(entityType, () => {
    entityUuid.value = null
  })

  function reset () {
    entityType.value = null
    entityUuid.value = null
  }

  return {
    entityType,
    entityUuid,
    entityTypeOptions,
    entityOptions,
    reset
  }
}
