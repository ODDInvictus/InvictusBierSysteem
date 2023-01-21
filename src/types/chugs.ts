export type Bak = {
  giver: string
  reason: string
  date: string
}

export type StrafbakOverview = {
  username: string
  nickname: string
  strafbakken: number
}

export type BakOverview = {
  username: string
  nickname: string
  bakken: number
}

export type StrafbakDetails = {
  strafbakken: number
  details: Bak[]
}

export type BakDetails = {
  bakken: number
  details: Bak[]
}