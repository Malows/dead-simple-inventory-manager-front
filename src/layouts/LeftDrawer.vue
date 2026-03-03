<script setup lang="ts">
import { DRAWER_ITEMS } from '../constants'
import DrawerLink from './DrawerLink.vue'

const show = defineModel<boolean>()
</script>

<template>
  <q-drawer class="bg-grey-1" v-model="show" show-if-above bordered>
    <q-list>
      <drawer-link v-for="link in DRAWER_ITEMS" :key="link.to.toString()" :link />
    </q-list>
  </q-drawer>
</template>
