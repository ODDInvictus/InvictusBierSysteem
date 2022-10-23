import config from '../../config.json'

export const setTitle = (title: string) => {
  const prefix = config.app.shortName || 'config.app.shortName'
  document.title = `${prefix} :: ${title}`
}

export function getConfig() {
  return config
}

async function generateAPIToken(): Promise<{ token: string, expiry: number }> {
  // first check the cache
  const cache = sessionStorage.getItem('ibs::token')
  if (cache) {
    const { token, expiry } = JSON.parse(cache)
    if (expiry > Date.now()) {
      return { token, expiry }
    }
  }
  // expires in 15 minutes, so regenerate in 14
  const expiry = Date.now() + 14 * 60 * 1000 
  const token = (await window.account.createJWT()).jwt
  return { token, expiry }
}

export async function fetchBackend(route: string, jsonResult = true, method?: RequestInit['method'], body?: Record<string, unknown>) {
  const token = await generateAPIToken() 

  return await fetch(import.meta.env.VITE_BACKEND_ENDPOINT + route, {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.token}`
    },
    body: body ? JSON.stringify(body) : undefined
  }).then(res => {
    if (jsonResult) return res.json()
    return res
  })
}