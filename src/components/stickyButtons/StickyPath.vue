<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'
import { useStickyButton } from '../../composition/components/stickyButtons'

withDefaults(
  defineProps<{
    icon?: string;
    to?: RouteLocationRaw;
    size?: string;
    color?: string;
  }>(),
  {
    icon: 'add',
    to: '/',
    size: 'md',
    color: 'accent'
  }
)

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
      :to
    />
  </q-page-sticky>
</template>
