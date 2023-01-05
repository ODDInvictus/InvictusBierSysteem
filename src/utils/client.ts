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
        'X-CSRFToken': this.getCookie('csrftoken') ?? ''
      },
      credentials: 'include',
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    const res = await fetch(this.url + endpoint, config)

    const contentType = res.headers.get('Content-Type')

    if (contentType && contentType.includes('application/json')) {
      return res.json()
    }

    // @ts-expect-error -- We want to return undefined if the body is not used
    return undefined
  }

  private getCookie(name: string) {
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }

  login(username: string, password: string): Promise<void> {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')

    return fetch(`${this.url}/user/login/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => {
      if (res.status === 400) {
        throw new Error('Gebruikersnaam of wachtwoord incorrect')
      }
      return res.json()
    }).then((res: LoginResponse) => {
      this.user = res.user

      cache.set('user', res.user)
      cache.set('committees', res.committees)
      cache.set('committee_members', res.committee_members)
    })
  }
}

type LoginResponse = {
  user: User
  committees: Committee[]
  committee_members: CommitteeMember[]
}

export const client = new APIClient()