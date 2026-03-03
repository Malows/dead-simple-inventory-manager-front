<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <p class="text-body1">
    <strong>{{ label }}: </strong>
    {{ " " }}
    <slot></slot>
  </p>
</template>
