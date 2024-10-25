class Service {
  protected getToken () {
    const prefix = process.env.STORAGE_PREFIX ?? ''

    return localStorage.getItem(`${prefix}_access_token`) || ''
  }

  protected authHeader (): Record<string, string> {
    return {
      Authorization: this.getToken(),
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  protected commonHeader (): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  protected authFileHeader (): Record<string, string> {
    return {
      Authorization: this.getToken(),
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  protected commonFileHeader (): Record<string, string> {
    return {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
}

export default Service
