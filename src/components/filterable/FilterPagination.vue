<script setup lang="ts">
defineProps<{ max: number }>()

const model = defineModel({
  type: Number,
  default: 1
})
</script>

<template>
  <div class="row justify-center">
    <q-pagination
      v-model="model"
      class=".q-mt-md.col-auto"
      :max
      :max-pages="5"
      boundary-numbers
      boundary-links
      direction-links
      />
  </div>
</template>
