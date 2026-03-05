<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

import StickyPath from '../stickyButtons/StickyPath.vue'
import StickyBtn from '../stickyButtons/StickyBtn.vue'

withDefaults(
  defineProps<{
    title?: string;
    to?: RouteLocationRaw | null;
  }>(),
  {
    title: '',
    to: null
  }
)

defineEmits<{ click: [void] }>()
</script>

<template>
  <q-page padding>
    <h4>{{ title }}</h4>

    <sticky-path
      v-if="to"
      icon="add"
      :to
    />
    <sticky-btn
      v-else
      icon="add"
      @click="$emit('click')"
    />

    <slot />
  </q-page>
</template>
