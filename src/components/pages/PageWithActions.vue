<script setup lang="ts">
import StickyActions from '../stickyButtons/StickyActions.vue'

withDefaults(
  defineProps<{ title?: string }>(),
  { title: '' }
)
</script>

<template>
  <q-page padding>
    <h4>{{ title }}</h4>

    <sticky-actions style="z-index: 10">
      <slot name="actions"></slot>
    </sticky-actions>

    <slot></slot>
  </q-page>
</template>
