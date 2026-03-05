<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <q-input
    class="q-my-md"
    type="search"
    clearable
    v-model="model"
    :debounce="300"
  >
    <template #append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>
