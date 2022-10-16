import { Permission, Role } from "https://deno.land/x/appwrite@6.1.0/mod.ts";
import { client, db, storage, teams, users } from "./sdk.ts";

export async function setupAppwrite() {

  await setupTeams()
  await setupStorage()

  await setupDatabase()
}

async function setupDatabase() {
  await db.create('main', 'Main database')

  // setup Collections

  await db.createCollection('main', 'activiteiten', 'Activiteiten', [
    Permission.read(Role.team('lid')),
    Permission.read(Role.team('proeflid')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
  ])

  await db.createCollection('main', 'beproefing', 'Beproefing', [
    Permission.read(Role.team('lid')),
    Permission.create(Role.team('fepeco')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
  ])

  // setup attributes

  await db.createStringAttribute('main', 'activiteiten', 'naam', 512, true, 'Reguliere Borrel')
  await db.createDatetimeAttribute('main', 'activiteiten', 'datum', true)
  await db.createStringAttribute('main', 'activiteiten', 'omschrijving', 4096, true, 'Omschrijving volgt')
  await db.createStringAttribute('main', 'activiteiten', 'organisatie', 512, true, 'Senaat')
  await db.createStringAttribute('main', 'activiteiten', 'organisatieId', 512, true, 'senaat')
  await db.createStringAttribute('main', 'activiteiten', 'aanwezigen', 128, false, undefined, true)
  await db.createStringAttribute('main', 'activiteiten', 'aanwezigenIds', 128, false, undefined, true)

  await db.createStringAttribute('main', 'beproefing', 'naam', 512, true, 'Beproefing activiteit')
  await db.createDatetimeAttribute('main', 'beproefing', 'datum', true)
  await db.createStringAttribute('main', 'beproefing', 'omschrijving', 4096, true, 'Ik ben een feut en heb nog geen omschrijving ingevuld')
  // staat deze ook in het rijtje activiteiten of staat daar 'Gewone borrel'?
  await db.createBooleanAttribute('main', 'beproefing', 'staatTussenActiviteiten', true, false)
}

// Setup all user roles
async function setupTeams() {
  await teams.create('admin', 'Admin', ['owner'])
  await teams.create('senaat', 'Senaat', ['owner'])
  await teams.create('colosseum', 'Colosseum', ['owner'])
  await teams.create('kasco', 'KasCo', ['owner'])
  await teams.create('fepeco', 'FePeCo', ['owner'])
  await teams.create('lid', 'Lid', ['owner'])
  await teams.create('proeflid', 'Proeflid', ['owner'])
}

async function setupStorage() {
  // Create the user icon bucket
  await storage.createBucket('user-icons', 'User Icons', [
    Permission.read(Role.team('lid')),
    Permission.create(Role.team('lid')),
    Permission.create(Role.team('proeflid')),
    Permission.create(Role.team('proeflid')),
  ], true, true, 30000000, ['jpg', 'jpeg', 'png', 'gif'], 'gzip', false, true)
}