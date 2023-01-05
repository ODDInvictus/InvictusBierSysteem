
export type Generation = {
  name: string
  generation_number: number
  start_date: string
}

export type User = {
  became_aspiring_member: string
  became_member: string
  bio: string
  birth_date: string
  date_joined: string
  email: string
  first_drink_invited_at: string
  first_name: string
  generation: number
  id: number
  is_active: boolean
  is_staff: boolean
  last_name: string
  nickname: string
  phone_number: string
  profile_picture: string
  username: string
}

export type Committee = {
  id: number
  name: string
  abbreviation: string
  description: string
  created_at: string
  updated_at: string

  active: boolean
  admin_rights: boolean

  website: string
  email: string
  logo: string
  photo: string
}

export type CommitteeMember = {
  id: number
  user: number // User ID
  committee: number // Committee ID
  function: string
  note: string
  begin: string
  end: string
  active: boolean
}

// export type CommitteeName = 'Admin' | 'Senaat' | 'Colosseum' | 'FinanCie' | 'Bakkentrekker' | 'Lid' | 'Feut'

// Dit zijn commissie namen zoals ze in AD staan. Als je dit ergens in een UI wil hebben staan kan je singularCommitteeName gebruiken.
export enum CommitteeName {
  Admins = 'Admins',
  Senaat = 'Senaat',
  Colosseum = 'Colosseum',
  FinanCie = 'FinanCie',
  Bakkentrekkers = 'Bakkentrekkers',
  Leden = 'Leden',
  Feuten = 'Feuten', 
}

export function singularCommitteeName(name: CommitteeName): string {
  switch (name) {
  case CommitteeName.Admins:
    return 'Admin'
  case CommitteeName.Senaat:
    return 'Senaat'
  case CommitteeName.Colosseum:
    return 'Colosseum'
  case CommitteeName.FinanCie:
    return 'FinanCie'
  case CommitteeName.Bakkentrekkers:
    return 'Bakkentrekker'
  case CommitteeName.Leden:
    return 'Lid'
  case CommitteeName.Feuten:
    return 'Feut'
  default:
    return 'Alles is stuk'
  }
}
