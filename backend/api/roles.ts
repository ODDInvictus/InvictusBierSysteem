import { teams, users } from "./sdk.ts";


export enum Roles {
  Senaat = 'Senaat',
  Admin = 'Admin',
  Colosseum = 'Colosseum',
  KasCo = 'KasCo',
  Lid = 'Lid',
  Proeflid = 'Proeflid',
}

export const admins = [Roles.Senaat, Roles.Admin]

const domain = Deno.env.get('IBS_DOMAIN')

function addUserToRole(email: string, role: Roles) {
  teams.createMembership(role, email, ['member'], domain || '')
}

function checkRole(userId: string, role: Roles): boolean {
  console.log('check role')
  return false
} 


export async function hasAdminPowers(userId: string): Promise<boolean> {
  const s = await users.listSessions(userId)
  console.log(s)
  return true
}