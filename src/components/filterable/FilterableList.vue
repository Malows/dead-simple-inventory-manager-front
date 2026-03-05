<script setup lang="ts" generic="T">
import { ref, computed } from 'vue'

import { byName } from '../../utils/filters'

import FilterInput from './FilterInput.vue'
import FilterPagination from './FilterPagination.vue'

const props = withDefaults(
  defineProps<{
    items: T[];
    filterFn?:(search: string) => (item: T) => boolean;
    itemsPerPage?: number;
  }>(),
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    filterFn: byName,
    itemsPerPage: 10
  }
)

const emit = defineEmits<{ changeSearch: [value: string] }>()

const searchField = ref('')
const currentPage = ref(1)

const filtered = computed(() => {
  if (!props.items) return []
  if (!searchField.value) return props.items

  return props.items.filter((x: T) => props.filterFn(searchField.value)(x))
})

const numberOfPages = computed(() => Math.ceil(filtered.value.length / props.itemsPerPage))

const sliced = computed(() =>
  filtered.value.slice(
    (currentPage.value - 1) * props.itemsPerPage,
    currentPage.value * props.itemsPerPage
  )
)

const changeOfSearchValue = (newValue: string) => {
  currentPage.value = 1
  emit('changeSearch', newValue)
}
</script>

<template>
  <div>
    <filter-input
      v-model="searchField"
      @update:model-value="changeOfSearchValue"
    />

    <q-list>
      <template v-for="item in sliced">
        <slot :item="item" />
      </template>
    </q-list>

    <filter-pagination
      v-model="currentPage"
      :max="numberOfPages"
    />
  </div>
</template>
