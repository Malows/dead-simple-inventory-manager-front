<script setup lang="ts">
import { QBtn } from 'quasar'
import { useStickyButton } from '../../composition/components/stickyButtons'

withDefaults(
  defineProps<{
    icon?: string;
    size?:(typeof QBtn)['props']['size']['default'];
    color?: string;
  }>(),
  {
    icon: 'add',
    size: 'md',
    color: 'accent'
  }
)

defineEmits<{ click: [void] }>()

const { position, offset } = useStickyButton()
</script>

<template>
  <q-page-sticky
    :position
    :offset
  >
    <q-btn
      round
      :color
      :size
      :icon
      @click="$emit('click')"
    />
  </q-page-sticky>
</template>
