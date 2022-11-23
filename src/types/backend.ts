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

export enum TransactieType {
  inkoop = 'inkoop',
  streeplijst = 'streeplijst',
  statiegeld = 'statiegeld',
  declaratie = 'declaratie',
  overig = 'overig',
}


export type Transactie = {
  $id: string
  $createdAt: string
  $updatedAt: string
  userId: string
  productId: string

  transactieType: TransactieType
  omschrijving: string

  aantal: number | 1
  prijsPerStuk?: number
  mutatie: number

  verrekend: boolean
}

// export type Consumptie = Transactie & {
//   product: Product
//   aantal: number
//   prijs: number
//   totaalBedrag: number
//   statiegeld: number
//   winkel: string
// }

// export type VerkoopTrasnactie = Transactie & {
//   product: Product
//   aantal: number
//   prijsPerStuk: number
//   prijsTotaal: number
// }

// export type OverigeTransactive = Transactie & {
//   omschrijving: string
//   prijs: number
// }