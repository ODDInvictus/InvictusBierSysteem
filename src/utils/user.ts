export type ColorSchemes = 'light' | 'dark'

export type UserPreferences = {
  colorScheme: ColorSchemes
  defaultLocation: string
  icon: string
  role: string
}

export type NewUserPreferences = {
  colorScheme?: ColorSchemes
  defaultLocation?: string
  icon?: string
  role?: string
}

export async function setUserPreferences(newPrefs: NewUserPreferences) {
  const oldPrefs = await getUserPreferences()

  const n = Object.assign(oldPrefs, newPrefs)

  await window.account.updatePrefs(n)
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const prefs = await window.account.getPrefs()

  return prefs as UserPreferences
}

export enum Roles {
  Senaat = 'Senaat',
  Admin = 'Admin',
  Colosseum = 'Colosseum',
  Kasco = 'Kasco',
  Lid = 'Lid',
  Proeflid = 'Proeflid',
}

export async function getRoles(): Promise<Roles[]> {
  const cache = getRolesFromCache()

  if (!cache) {
    const roles = await fetch(import.meta.env.VITE_BACKEND_ENDPOINT + 'users/roles')
      .then(res => res.json())
      .then(roles => roles as Roles[])

    setRolesCache(roles)

    return roles
  }

  return cache 
}

function getRolesFromCache(): Roles[] | undefined {
  const roles = sessionStorage.getItem('ibs::roles')

  if (roles) {
    const arr = roles.split(',')

    return arr as Roles[]
  }

  return undefined
}

function setRolesCache(roles: Roles[]) {
  sessionStorage.setItem('ibs::roles', roles.join(','))
}