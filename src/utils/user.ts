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