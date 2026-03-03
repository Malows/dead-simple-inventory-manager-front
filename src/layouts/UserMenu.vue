<script setup lang="ts">
defineProps<{ user: { name: string } }>()
defineEmits<{ logout: [void] }>()
</script>

<template>
  <q-btn flat icon="account_box" :label="user.name" :ripple="false" aria-label="User">
    <q-menu class="q-pa-md">
      <div class="row">
        <p class="text-subtitle1 q-ma-md">{{ user.name }}</p>
      </div>

      <q-separator inset />

      <q-list class="q-mt" style="min-width: 100px">
        <q-item v-close-popup clickable @click="$emit('logout')">
          <q-item-section>Cerrar sesión</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
