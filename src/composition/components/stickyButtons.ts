import { computed } from 'vue'
import { useQuasar } from 'quasar'

const offset = [24, 24]

export function useStickyButton () {
  const quasar = useQuasar()

  const direction = computed(() => (quasar.platform.is.desktop ? 'down' : 'up'))
  const icon = computed(() =>
    quasar.platform.is.desktop ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
  )
  const position = computed(() => (quasar.platform.is.desktop ? 'top-right' : 'bottom-right'))

  return {
    direction,
    icon,
    position,
    offset
  }
}
