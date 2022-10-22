export type Activiteit = {
  $id: string
  naam: string
  datum: string
  omschrijving: string
  organisatie: string
  aanwezigen: string[]
  locatie: string
}

export type User = {
  $id: string
  email: string
  name: string
  prefs: {
    colorScheme: string
    icon: string
    defaultLocation: string
  }
}

export type Product = {
  naam: string
  alcohol: number
  inhoud: number
}

export type Inkoop = {
  userId: string
  productId: string
  hoeveelheid: number
  prijs: number
  statiegeld: number
  winkel: string
  datum: string
}