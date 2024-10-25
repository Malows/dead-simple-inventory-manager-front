import Service from './Service'
import HttpResponse, { handle } from './Response'

/**
 * Generic CRUD service
 */
class Generic<T> extends Service {
  /**
   * {string} _url
   */
  _url = ''

  /**
   * Format the url according the payload parameter.
   */
  url (id?: string): string {
    return id ? `${this._url}/${id}` : this._url
  }

  /**
   * Fetch the list of resources.
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
   */
  get (id: string): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(id), {
        headers: this.authHeader()
      })
    )
  }

  /**
   * Create a new resource.
   */
  create <T extends object> (payload: T): Promise<HttpResponse<T>> {
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
   */
  update <T extends object> (id: string, payload: T): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(id), {
        headers: this.authHeader(),
        method: 'PUT',
        body: JSON.stringify(payload)
      })
    )
  }

  /**
   * Delete the resource.
   */
  remove (id: string): Promise<HttpResponse<T>> {
    return handle<T>(
      fetch(this.url(id), {
        headers: this.authHeader(),
        method: 'DELETE'
      })
    )
  }
}

export default Generic
