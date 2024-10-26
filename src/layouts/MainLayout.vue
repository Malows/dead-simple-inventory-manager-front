<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useStore } from 'src/store'
import { pull, pullMany } from 'src/utils/api'

import UserMenu from './UserMenu.vue'
import LeftDrawer from './LeftDrawer.vue'

const NAME = process.env.NAME

const router = useRouter()
const quasar = useQuasar()

const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const store = useStore()
const user = computed(
  () => store.state.session.user as { name: string } | null
)
const logout = async () => {
  await store.dispatch('session/logout')
  return router.push({ name: 'login' })
}

onMounted(async () => {
  if (!user.value) {
    const response = await pull(store, quasar, 'session/fetchUserData').catch(
      logout
    )

    if (response.code === 401) {
      await logout()
    }
  }

  const responses = await pullMany(store, quasar, [
    ['categories/fetch'],
    ['suppliers/fetch']
  ])

  if (responses.some((x) => x.code === 401)) {
    await logout()
  }
})
</script>

<template>
  <q-layout v-if="user" view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />
        <q-toolbar-title>{{ NAME }}</q-toolbar-title>

        <user-menu :user @logout="logout" />
      </q-toolbar>
    </q-header>

    <left-drawer v-model="drawer" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
