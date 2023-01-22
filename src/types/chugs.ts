export type bak = {
  giver: string
  giver_username: string
  reason: string
  date: string
  dateReceiver: string | undefined
}

export type bakkenOverview = {
  username: string
  nickname: string
  bakken: number
}

export type bakDetails = {
  bakken: number
  details: bak[]
}