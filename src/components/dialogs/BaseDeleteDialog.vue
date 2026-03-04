<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface DeleteResult { isOk?: boolean }
type DeleteAction = () => Promise<DeleteResult>

const props = defineProps<{
  confirmMessage: string
  deleteAction: DeleteAction
  successRoute: string
  successMessageKey: string
  errorMessageKey: string
}>()

const show = defineModel<boolean>({ default: false })

const router = useRouter()
const quasar = useQuasar()
const { t } = useI18n()

const destroy = () => {
  quasar.loading.show()
  props
    .deleteAction()
    .then(({ isOk }) => {
      const color = isOk ? 'positive' : 'negative'
      const message = isOk ? t(props.successMessageKey) : t(props.errorMessageKey)
      quasar.notify({ color, message })

      if (isOk) {
        router.push({ name: props.successRoute })
      }
    })
    .catch(() => {
      quasar.notify({
        color: 'negative',
        message: t(props.errorMessageKey)
      })
    })
    .finally(() => {
      quasar.loading.hide()
    })
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ t("common.confirm") }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center">
        <div class="text-body1">
          {{ confirmMessage }}
        </div>
      </q-card-section>

      <q-card-section class="row items-center q-pb-none">
        <q-separator />
      </q-card-section>

      <q-card-actions class="q-mt-sm" align="right">
        <q-btn v-close-popup flat color="red" :label="t('common.delete')" @click="destroy" />
        <q-btn v-close-popup flat color="primary" :label="t('common.cancel')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
