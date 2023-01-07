import { Committee, CommitteeMember, User } from '../types/users'
import { cache } from './cache'

class APIClient {

  private url: string

  token: string
  expiry: Date
  user: User | undefined

  constructor() {
    this.url = import.meta.env.VITE_BACKEND_ENDPOINT
    this.token = ''
    this.expiry = new Date()
    this.user = undefined
  }

  // eslint-disable-next-line @typescript-eslint/ban-types -- We want to allow any value to be passed in, which is non-null
  async get<T>(endpoint: string): Promise<T extends {} ? T : undefined> {
    return this.req(endpoint, 'GET')
  }

  // eslint-disable-next-line @typescript-eslint/ban-types -- We want to allow any value to be passed in, which is non-null
  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T extends {} ? T : undefined> {
    return this.req(endpoint, 'POST', body)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types -- We want to allow any value to be passed in, which is non-null
  async delete<T>(endpoint: string): Promise<T extends {} ? T : undefined> {
    return this.req(endpoint, 'DELETE')
  }

  // eslint-disable-next-line @typescript-eslint/ban-types -- We want to allow any value to be passed in, which is non-null
  async patch<T>(endpoint: string, body: Record<string, unknown>): Promise<T extends {} ? T : undefined> {
    return this.req(endpoint, 'PATCH', body)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types -- We want to allow any value to be passed in, which is non-null
  private async req<T>(endpoint: string, method: string, body?: Record<string, unknown>): Promise<T extends {} ? T : undefined> {
    const config: Record<string, unknown> = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.getToken()}`
      }
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const res = await fetch(this.url + endpoint, config)

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const contentType = res.headers.get('Content-Type')

    if (contentType && contentType.includes('application/json')) {
      return res.json()
    }

    // @ts-expect-error -- We want to return undefined if the body is not used
    return undefined
  }


  getToken(): string {
    if (this.token) return this.token

    const token = cache.get<string>('token')
    const expiry = cache.get<Date>('expiry')

    if (!token || !expiry) {
      return ''
    }

    // if the token is expired, remove it from the cache and return an empty string
    if (expiry < new Date()) {
      cache.remove('token')
      cache.remove('expiry')
      return ''
    }

    this.token = token
    this.expiry = expiry

    return token
  }

  login(username: string, password: string): Promise<void> {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', 'Basic ' + window.btoa(`${username}:${password}`))    

    return fetch(`${this.url}/knox/login/`, {
      method: 'POST',
      headers,
    }).then(res => {
      if (res.status === 400) {
        throw new Error('Gebruikersnaam of wachtwoord incorrect')
      }
      return res.json()
    }).then((res: LoginResponse) => {
      this.token = res.token
      
      cache.set('expiry', res.expiry)
      cache.set('token', res.token)
    })
  }

  logout(): Promise<void> {
    return this.get('/knox/logout/')
  }
}

type LoginResponse = {
  expiry: string
  token: string
}

export const client = new APIClient()