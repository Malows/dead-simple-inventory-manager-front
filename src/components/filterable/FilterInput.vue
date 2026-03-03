<script setup lang="ts">
const data = defineModel({
  type: String,
  default: ''
})
</script>

<template>
  <q-input
    class="q-my-md"
    type="search"
    clearable
    v-model="data"
    :debounce="300"
  >
    <template #append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>
