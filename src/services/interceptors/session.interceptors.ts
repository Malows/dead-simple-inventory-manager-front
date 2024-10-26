import { formatISO, addSeconds, addDays } from 'date-fns'
import { PlainSession, RawSession, Session } from '../../types/session.interfaces'

export function mapSession ({ expires_in: expiresIn, token_type: tokenType, access_token: accessToken, refresh_token: refreshToken }: RawSession): Session {
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
