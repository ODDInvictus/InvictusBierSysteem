import { Committee, User } from './users'

export type Activity = {
  id: number
  name: string
  description: string
  date: string
  start_time: string
  location: string
  organisation: Committee
  members_only: boolean
}

export type Participant = {
  user: string
  email: string
  profile_picture: string
  user_id: number
  present: boolean
}