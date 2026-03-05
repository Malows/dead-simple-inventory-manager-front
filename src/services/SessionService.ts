import Service from './Service'
import HttpResponse, { handle } from './Response'

interface SessionContext {
  clientSecret: string;
  clientID: string;
  url: string;
  oauthURI: string;
  profileURI: string;
}

interface SessionPayload {
  username: string;
  password: string;
}

class SessionService extends Service {
  clientSecret: string
  clientID: string
  loginURL: string
  userURL: string

  constructor ({ clientSecret, clientID, url, oauthURI, profileURI }: SessionContext) {
    super()
    this.clientSecret = clientSecret
    this.clientID = clientID
    this.loginURL = url + '/' + oauthURI
    this.userURL = url + '/' + profileURI
  }

  login<T> ({ username, password }: SessionPayload): Promise<HttpResponse<T>> {
    const body = JSON.stringify({
      username,
      password,
      client_secret: this.clientSecret,
      client_id: this.clientID,
      grant_type: 'password',
      scope: '*'
    })

    return handle(
      fetch(this.loginURL, {
        method: 'POST',
        headers: this.commonHeader(),
        body
      })
    )
  }

  fetchUserData<T> (): Promise<HttpResponse<T>> {
    const headers = this.authHeader()

    return handle(fetch(this.userURL, { headers }))
  }
}

export default SessionService
