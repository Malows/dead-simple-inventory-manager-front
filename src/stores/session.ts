import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isPast } from 'date-fns'

import SessionService from '../services/SessionService'
import { mapSession, setStorage, getStorage, removeStorage } from '../services/interceptors/session.interceptors'
import { RawSession, User } from 'src/types/session.interfaces'

const PREFIX = process.env.STORAGE_PREFIX || 'session'

const service = new SessionService({
  clientSecret: process.env.CLIENT_SECRET || '',
  clientID: process.env.CLIENT_ID || '',
  url: process.env.API_URL || '',
  oauthURI: process.env.OAUTH_URI || '',
  profileURI: process.env.PROFILE_URI || ''
})

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref('')
  const refreshToken = ref('')
  const loginAt = ref<Date | null>(null)
  const expirationAt = ref<Date | null>(null)
  const refreshExpirationAt = ref<Date | null>(null)

  async function login (payload: { username: string, password: string }) {
    const response = await service.login<RawSession>(payload)

    if (response.data) {
      const parsed = mapSession(response.data)

      accessToken.value = parsed.accessToken
      refreshToken.value = parsed.refreshToken
      loginAt.value = parsed.loginAt
      expirationAt.value = parsed.expirationAt
      refreshExpirationAt.value = parsed.refreshExpirationAt

      setStorage(PREFIX, parsed)

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

    removeStorage(PREFIX)
  }

  async function checkSession () {
    const values = getStorage(PREFIX)

    if (!values) {
      return null
    }

    const { loginAt, expirationAt, accessToken } = values

    const areInvalid = !(loginAt && expirationAt && accessToken)

    if (areInvalid || isPast(expirationAt)) {
      return null
    }

    return fetchUserData()
  }

  const user = ref<User | null>(null)
  async function fetchUserData () {
    const response = await service.fetchUserData<User>()

    if (response.data) {
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

    login,
    logout,
    checkSession,

    user,
    fetchUserData
  }
})
