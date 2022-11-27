function saveToken(token: string) {
  localStorage.setItem('ibs::token', token)
}

/**
 * TODO: Check if token is still valid
 */
function getToken() {
  return localStorage.getItem('ibs::token')
}

export function setUser(user: any) {
  localStorage.setItem('ibs::user', JSON.stringify(user))
}

export function getUser() {
  const user = localStorage.getItem('ibs::user')!
  return user
}

function baseUrl() {
  return import.meta.env.VITE_BACKEND_ENDPOINT
}

export async function checkToken() {
  const token = getToken()
  if (!token) return false
  const valid = await post('/auth/check/', { token })

  if (valid) return true

  saveToken('')
  return false
}


export async function login(username: string, password: string) {
  post('user/login/', { username, password }, true)
    .then((res: any) => {
      const { user, token } = res
      saveToken(token)
      setUser(user)
    })
}

/**
 * Perform a GET request
 */
export function get(endpoint: string, isJson = true): Promise<unknown> {
  const token = getToken()

  return fetch(baseUrl() + endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => {
    if (isJson) {
      return res.json()
    }
    return res.text()
  })
}

export function post(endpoint: string, body: unknown, isJson = true): Promise<unknown> {
  const token = getToken()

  return fetch(baseUrl() + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }).then(res => {
    if (isJson) {
      return res.json()
    }
    return res.text()
  })
}
