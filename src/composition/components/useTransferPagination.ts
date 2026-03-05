import { ref, computed, watch } from 'vue'

import type { Ref } from 'vue'

export function useTransferPagination (
  leftItems: () => unknown[],
  rightItems: () => unknown[],
  itemsPerPage = 10
) {
  const leftPage = ref(1)
  const rightPage = ref(1)

  const leftPages = computed(() => Math.ceil(leftItems().length / itemsPerPage) || 1)
  const rightPages = computed(() => Math.ceil(rightItems().length / itemsPerPage) || 1)

  const leftSlice = computed(() =>
    leftItems().slice((leftPage.value - 1) * itemsPerPage, leftPage.value * itemsPerPage)
  )
  const rightSlice = computed(() =>
    rightItems().slice((rightPage.value - 1) * itemsPerPage, rightPage.value * itemsPerPage)
  )

  function resetLeftPage () {
    leftPage.value = 1
  }

  function watchFilters (filters: Ref[]) {
    watch(filters, () => {
      leftPage.value = 1
    })
  }

  return {
    leftPage,
    rightPage,
    leftPages,
    rightPages,
    leftSlice,
    rightSlice,
    resetLeftPage,
    watchFilters
  }
}
