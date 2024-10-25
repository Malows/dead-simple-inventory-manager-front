import Service from './Service'
import HttpResponse, { handle } from './Response'

interface UrlParameter {
  [key: string]: unknown
}

/**
 * Generic CRUD service
 */
class Generic<T> extends Service {
  /**
   * {string} _url
   */
  _url = ''

  /**
   * {string} _idProperty
   */
  _idProperty = 'id'

  /**
   * Format the url according the payload parameter.
   *
   * @param {Record<string, unknown>|undefined} parameter
   *
   * @returns {string}
   */
  url (parameter?: UrlParameter): string {
    return parameter
      ? `${this._url}/${String(parameter[this._idProperty])}`
      : this._url
  }

  /**
   * Fetch the list of resources.
   *
   * @returns {Promise<HttpResponse<T[]>>}
   */
  fetch (): Promise<HttpResponse<T[]>> {
    return handle<T[]>(
      fetch(this.url(), {
        headers: this.authHeader()
      })
    )
  }

  /**
   * Fetch the individual resource.
   *
   * @param {UrlParameter} payload
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  get (payload: UrlParameter): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(payload), {
        headers: this.authHeader()
      })
    )
  }

  /**
   * Create a new resource.
   *
   * @param {UrlParameter} payload
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  create (payload: UrlParameter): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(), {
        headers: this.authHeader(),
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }

  /**
   * Update the resource.
   *
   * @param {UrlParameter} payload
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  update (payload: UrlParameter): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(payload), {
        headers: this.authHeader(),
        method: 'PUT',
        body: JSON.stringify(payload)
      })
    )
  }

  /**
   * Delete the resource.
   *
   * @param {UrlParameter} payload
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  remove (payload: UrlParameter): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(payload), {
        headers: this.authHeader(),
        method: 'DELETE'
      })
    )
  }
}

export default Generic
