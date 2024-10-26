import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isPast, parseISO } from 'date-fns'

import Service from '../service'
import utils from '../utils'

const PREFIX = process.env.STORAGE_PREFIX

const service = new Service({

})

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref('')
  const refreshToken = ref('')
  const loginAt = ref<Date | null>(null)
  const expirationAt = ref<Date | null>(null)
  const refreshExpirationAt = ref<Date | null>(null)

  const user = ref(null)

  const { getValues, parseValuesFromResponse } = utils(context)

  async function login (payload) {
    const response = await service.login(payload)

    if (response.isOk) {
      const parsed = parseValuesFromResponse(response)

      accessToken.value = parsed.accessToken
      refreshToken.value = parsed.refreshToken
      loginAt.value = parsed.loginAt
      expirationAt.value = parsed.expirationAt
      refreshExpirationAt.value = parsed.refreshExpirationAt

      localStorage.setItem(`${PREFIX}_access_token`, parsed.accessToken)
      localStorage.setItem(`${PREFIX}_refresh_token`, parsed.refreshToken)
      localStorage.setItem(`${PREFIX}_login_at`, parsed.loginAt)
      localStorage.setItem(`${PREFIX}_expiration_at`, parsed.expirationAt)
      localStorage.setItem(`${PREFIX}_refresh_expiration_at`, parsed.refreshExpirationAt)

      await fetchUserData()
    }

    return response
  }

  function logout () {
    accessToken.value = ''
    refreshToken.value = ''
    loginAt.value = null
    expirationAt.value = null
    refreshExpirationAt.value = null
    user.value = null

    localStorage.removeItem(`${PREFIX}_access_token`)
    localStorage.removeItem(`${PREFIX}_refresh_token`)
    localStorage.removeItem(`${PREFIX}_login_at`)
    localStorage.removeItem(`${PREFIX}_expiration_at`)
    localStorage.removeItem(`${PREFIX}_refresh_expiration_at`)
  }

  async function checkSession () {
    const values = getValues()
    const { loginAt, expirationAt, accessToken } = values

    const areInvalid = !(loginAt && expirationAt && accessToken)

    if (areInvalid || isPast(parseISO(expirationAt))) {
      return false
    }

    commit('login', values)

    const response = await dispatch('fetchUserData')

    return response
  }

  async function fetchUserData () {
    const response = await (new Service(context)).fetchUserData()

    if (response.isOk) {
      user.value = response.data
    }

    return response
  }

  return {

    accessToken,
    refreshToken,
    loginAt,
    expirationAt,
    refreshExpirationAt,
    user
  }
})
