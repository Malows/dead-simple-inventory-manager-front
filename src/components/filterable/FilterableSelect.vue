<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'

import { SelectOption } from '../../types/index'

const props = defineProps<{
  label: string;
  options: SelectOption<T>[];
}>()

const model = defineModel<T>()

const filteredOptions = ref<SelectOption<T>[]>(props.options)

watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions
})

function filterFn (val: string, update: (callback: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = !needle
      ? props.options
      : props.options.filter((v) => v.label.toLowerCase().includes(needle))
  })
}

function abortFilterFn () {
  filteredOptions.value = props.options
}
</script>

<template>
  <q-select
    v-model="model"
    :label="label"
    clearable
    use-input
    hide-selected
    fill-input
    emit-value
    map-options
    input-debounce="0"
    :options="filteredOptions"
    @filter="filterFn"
    @filter-abort="abortFilterFn"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
