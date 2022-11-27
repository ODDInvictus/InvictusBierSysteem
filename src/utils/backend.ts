function saveToken(token: string) {
  localStorage.setItem('ibs::token', JSON.stringify({
    token,
    dateSet: Date.now()
  }))
}

/**
 * TODO: Check if token is still valid
 */
export function getToken() {
  const token = localStorage.getItem('ibs::token')
  if (token) {
    const a  = JSON.parse(token)
    
    // If token is older than 8 hours, delete it
    if (Date.now() - a.dateSet > 8 * 60 * 60 * 1000) {
      localStorage.removeItem('ibs::token')
      return null
    }

    return a.token
  }
}

export function setUser(user: any) {
  localStorage.setItem('ibs::user', JSON.stringify(user))
}

export function getUser() {
  const user = localStorage.getItem('ibs::user')!
  return JSON.parse(user)
}

export function setCommittees(committees: string) {
  localStorage.setItem('ibs::committees', JSON.stringify(committees))
}

export function getCommittees() {
  return localStorage.getItem('ibs::committees')!
}  

export function setCommitteeFunctions(functions: string) {
  localStorage.setItem('ibs::committeeFunctions', JSON.stringify(functions))
}

export function getCommitteeFunctions() {
  return localStorage.getItem('ibs::committeeFunctions')!
}
  

function baseUrl() {
  return import.meta.env.VITE_BACKEND_ENDPOINT
}

export async function checkToken() {
  const token = getToken()
  if (!token) return false
  const res: any = await post('user/token-valid/', { token })

  if (res.details !== '') return false

  if (res) return true

  saveToken('')
  return false
}


export async function login(username: string, password: string) {
  await post('user/login/', { username, password }, true)
    .then((res: any) => {
      const { user, token, committees, committee_members } = res
      saveToken(token)
      setUser(user)
      setCommittees(committees)
      setCommitteeFunctions(committee_members)
      alert()
    })
    .catch(err => {
      console.error(err)
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
