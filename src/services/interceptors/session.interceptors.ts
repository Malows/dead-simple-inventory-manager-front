import { formatISO, addSeconds, addDays } from 'date-fns'
import { PlainSession, RawSession, Session } from '../../types/session.interfaces'

export function mapSession ({
  expires_in: expiresIn,
  token_type: tokenType,
  access_token: accessToken,
  refresh_token: refreshToken
}: RawSession): Session {
  const loginAt = new Date()
  const expirationAt = addSeconds(loginAt, expiresIn)
  const refreshExpirationAt = addDays(expirationAt, 7)

  return {
    accessToken: `${tokenType} ${accessToken}`,
    refreshToken: `${tokenType} ${refreshToken}`,
    loginAt,
    expirationAt,
    refreshExpirationAt
  }
}

export function mapPlainSession (session: Session): PlainSession {
  return {
    ...session,
    loginAt: formatISO(session.loginAt),
    expirationAt: formatISO(session.expirationAt),
    refreshExpirationAt: formatISO(session.refreshExpirationAt)
  }
}

export function setStorage (prefix: string, session: Session) {
  const plain = mapPlainSession(session)
  localStorage.setItem(`${prefix}_access_token`, plain.accessToken)
  localStorage.setItem(`${prefix}_refresh_token`, plain.refreshToken)
  localStorage.setItem(`${prefix}_login_at`, plain.loginAt)
  localStorage.setItem(`${prefix}_expiration_at`, plain.expirationAt)
  localStorage.setItem(`${prefix}_refresh_expiration_at`, plain.refreshExpirationAt)
}

export function getStorage (prefix: string): Session | null {
  const accessToken = localStorage.getItem(`${prefix}_access_token`)
  const refreshToken = localStorage.getItem(`${prefix}_refresh_token`)
  const loginAt = localStorage.getItem(`${prefix}_login_at`)
  const expirationAt = localStorage.getItem(`${prefix}_expiration_at`)
  const refreshExpirationAt = localStorage.getItem(`${prefix}_refresh_expiration_at`)

  if (accessToken && refreshToken && loginAt && expirationAt && refreshExpirationAt) {
    return {
      accessToken,
      refreshToken,
      loginAt: new Date(loginAt),
      expirationAt: new Date(expirationAt),
      refreshExpirationAt: new Date(refreshExpirationAt)
    }
  }

  return null
}

export function removeStorage (prefix: string) {
  localStorage.removeItem(`${prefix}_access_token`)
  localStorage.removeItem(`${prefix}_refresh_token`)
  localStorage.removeItem(`${prefix}_login_at`)
  localStorage.removeItem(`${prefix}_expiration_at`)
  localStorage.removeItem(`${prefix}_refresh_expiration_at`)
}
