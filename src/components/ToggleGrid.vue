<script setup lang="ts" generic="T">
import { ref, computed } from 'vue'

import { SelectOption } from '../types'

const props = withDefaults(
  defineProps<{
    options: SelectOption<T>[];
    label?: string;
  }>(),
  {
    label: ''
  }
)

const model = defineModel<T[]>({ default: () => [] })
const filter = ref('')

const search = (value: string) => (x: { label: string; value: T }) =>
  x.label.toLowerCase().includes(value) || model.value.includes(x.value)

const filteredOptions = computed(() =>
  !filter.value ? props.options : props.options.filter(search(filter.value.toLowerCase()))
)
</script>

<template>
  <div>
    <p v-if="label">
      <strong>{{ label }}:</strong>
    </p>

    <q-input v-model="filter" type="search" clearable>
      <template #append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="common-grid">
      <q-toggle
        v-for="(x, index) in filteredOptions"
        :key="index"
        v-model="model"
        :val="x.value"
        :label="x.label"
        color="primary"
      />
    </div>
  </div>
</template>
