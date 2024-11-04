<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useSessionStore } from '../stores/session'

const router = useRouter()
const sessionStore = useSessionStore()
const quasar = useQuasar()
const { t } = useI18n()

const username = ref('')
const password = ref('')

const isPassword = ref(true)
const passwordIcon = computed(() => isPassword.value ? 'visibility' : 'visibility_off')
const passwordType = computed(() => isPassword.value ? 'password' : 'text')

const NAME = process.env.NAME

function submitLogin () {
  const payload = {
    username: username.value,
    password: password.value
  }

  quasar.loading.show()
  sessionStore
    .login(payload)
    .then(({ isOk }) => {
      if (!isOk) {
        quasar.notify({
          message: t('common.error_login'),
          color: 'negative'
        })
        return
      }
      router.push({ name: 'index' })
    })
    .catch(console.error)
    .finally(() => quasar.loading.hide())
}
</script>

<template>
  <q-page class="center-card">
    <q-card class="my-card shadow-8">
      <q-card-section class="bg-primary text-white q-pt-lg">
        <div class="text-h4">{{ NAME }}</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitLogin">
          <q-input
            v-model="username"
            :label="t('common.Email')"
            lazy-rules
            :rules="[val => val?.length > 0 || t('common.required_field')]"
          />
          <q-input
            v-model="password"
            :type="passwordType"
            :label="t('common.Password')"
            lazy-rules
            :rules="[val => val?.length > 0 || t('common.required_field')]"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                :name="passwordIcon"
                @click="isPassword = !isPassword"
              />
            </template>
          </q-input>
          <div class="text-center q-mt-lg">
            <q-btn
              class="full-width"
              :label="t('common.sign_in')"
              type="submit"
              size="lg"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss" scoped>
.center-card {
  display: grid;
  place-items: center;
}

.my-card {
  width: clamp(20rem, 50%, 32rem);
}
</style>
