import { ref, computed } from 'vue'

import type { Product } from '../../types/product.interfaces'

export function useTransferSelection (
  availableProducts: () => Product[],
  selectedProducts: () => Product[]
) {
  const leftChecked = ref<Set<string>>(new Set())
  const rightChecked = ref<Set<string>>(new Set())

  function toggleLeftCheck (uuid: string) {
    rightChecked.value.clear()
    if (leftChecked.value.has(uuid)) {
      leftChecked.value.delete(uuid)
    } else {
      leftChecked.value.add(uuid)
    }
  }

  function toggleRightCheck (uuid: string) {
    leftChecked.value.clear()
    if (rightChecked.value.has(uuid)) {
      rightChecked.value.delete(uuid)
    } else {
      rightChecked.value.add(uuid)
    }
  }

  function selectAllLeft () {
    rightChecked.value.clear()
    const all = availableProducts()
    if (leftChecked.value.size === all.length) {
      leftChecked.value.clear()
    } else {
      leftChecked.value = new Set(all.map((p) => p.uuid))
    }
  }

  function selectAllRight () {
    leftChecked.value.clear()
    const all = selectedProducts()
    if (rightChecked.value.size === all.length) {
      rightChecked.value.clear()
    } else {
      rightChecked.value = new Set(all.map((p) => p.uuid))
    }
  }

  const canMoveRight = computed(() => leftChecked.value.size > 0)
  const canMoveLeft = computed(() => rightChecked.value.size > 0)
  const buttonIcon = computed(() => (canMoveRight.value ? 'chevron_right' : 'chevron_left'))
  const buttonDisabled = computed(() => !canMoveRight.value && !canMoveLeft.value)

  function clearLeftChecked () {
    leftChecked.value.clear()
  }

  function clearRightChecked () {
    rightChecked.value.clear()
  }

  return {
    leftChecked,
    rightChecked,
    toggleLeftCheck,
    toggleRightCheck,
    selectAllLeft,
    selectAllRight,
    canMoveRight,
    canMoveLeft,
    buttonIcon,
    buttonDisabled,
    clearLeftChecked,
    clearRightChecked
  }
}
