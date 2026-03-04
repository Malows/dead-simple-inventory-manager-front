<script setup lang="ts" generic="T">
defineProps<{
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
  value: T;
}>()

const model = defineModel<T | null>({ default: null })
</script>

<template>
  <q-card
      class="col-12 col-sm-5 cursor-pointer selection-card"
      :class="{ 'selection-card--selected': model === value }"
      flat
      bordered
      @click="model = value"
    >
      <q-card-section horizontal>
        <q-card-section class="flex flex-center selection-card__section">
          <q-icon
            :name="icon"
            :color="color"
            size="40px"
          />
        </q-card-section>

        <q-card-section class=" full-width">
          <div class="text-subtitle1 text-weight-bold">
            {{ title }}
          </div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            {{ description }}
          </div>
          <q-badge
            :color="color"
            :label="action"
            class="q-mt-sm"
            outline
          />
        </q-card-section>

        <q-card-section  class="flex flex-center selection-card__section">
          <q-icon v-if="model === value" name="check_circle" color="primary" size="24px" />
        </q-card-section>
      </q-card-section>
    </q-card>
</template>

<style scoped lang="scss">
.selection-card {
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &__section {
    width: 72px;
  }

  &--selected {
    border-color: var(--q-primary);
    background: rgba($primary, 0.04);
  }
}

</style>
