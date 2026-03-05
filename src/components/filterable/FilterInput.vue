<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <q-input
    v-model="model"
    class="q-my-md"
    type="search"
    clearable
    :debounce="300"
  >
    <template #append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>
