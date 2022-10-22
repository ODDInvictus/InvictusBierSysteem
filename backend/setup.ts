import { Permission, Role } from "https://deno.land/x/appwrite@6.1.0/mod.ts";
import { client, db, storage, teams, users } from "./sdk.ts";

if (import.meta.main) setupAppwrite()

async function setupAppwrite() {

  await setupTeams()
  await setupStorage()

  await setupDatabase()
}

async function setupDatabase() {
  await db.create('main', 'Main database')
    .catch(() => console.log('[DB] Main database already exists, skipping...'))

  // setup Collections

  await db.createCollection('main', 'activiteiten', 'Activiteiten', [
    Permission.read(Role.team('lid')),
    Permission.read(Role.team('proeflid')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
    Permission.create(Role.team('lid')),
    Permission.update(Role.team('admin')),
    Permission.update(Role.team('senaat')),
    Permission.update(Role.team('lid')),
    Permission.delete(Role.team('admin')),
    Permission.delete(Role.team('senaat')),
  ]).catch(() => console.log('[DB] Activiteiten collection already exists, skipping...'))

  // setup attributes
  await db.createStringAttribute('main', 'activiteiten', 'naam', 512, false, 'Reguliere Borrel')
    .catch(() => console.log('[DB] Naam attribute already exists, skipping...'))
  await db.createDatetimeAttribute('main', 'activiteiten', 'datum', true)
    .catch(() => console.log('[DB] Datum attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'activiteiten', 'omschrijving', 4096, false, 'Omschrijving volgt')
    .catch(() => console.log('[DB] Omschrijving attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'activiteiten', 'organisatie', 512, false, 'Senaat')
    .catch(() => console.log('[DB] OrganisatieId attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'activiteiten', 'aanwezigen', 128, false, undefined, true)
    .catch(() => console.log('[DB] Aanwezigen attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'activiteiten', 'locatie', 512, true)
    .catch(() => console.log('[DB] Activiteiten attribute already exists, skipping...'))



  // Inventory
  await db.createCollection('main', 'producten', 'Producten', [
    Permission.read(Role.team('colosseum')),
    Permission.read(Role.team('senaat')),
    Permission.read(Role.team('admin')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
    Permission.create(Role.team('colosseum')),
    Permission.delete(Role.team('admin')),
    Permission.delete(Role.team('senaat')),
    Permission.delete(Role.team('colosseum')),
  ]).catch(() => console.log('[DB] Producten collection already exists, skipping...'))

  await db.createStringAttribute('main', 'producten', 'naam', 512, true)
    .catch(() => console.log('[DB] Naam attribute already exists, skipping...'))
  await db.createFloatAttribute('main', 'producten', 'alcohol', true, 0, 100)
    .catch(() => console.log('[DB] Alcohol attribute already exists, skipping...'))
  await db.createIntegerAttribute('main', 'producten', 'inhoud', true)
    .catch(() => console.log('[DB] Inhoud attribute already exists, skipping...'))

  await db.createCollection('main', 'streeplijsten', 'Streeplijsten', [
    Permission.read(Role.team('colosseum')),
    Permission.read(Role.team('senaat')),
    Permission.read(Role.team('admin')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
    Permission.create(Role.team('colosseum')),
    Permission.delete(Role.team('admin')),
    Permission.delete(Role.team('senaat')),
    Permission.delete(Role.team('colosseum')),
  ]).catch(() => console.log('[DB] Streeplijsten collection already exists, skipping...'))

  await db.createStringAttribute('main', 'streeplijsten', 'userId', 512, true)
    .catch(() => console.log('[DB] UserId attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'streeplijsten', 'productId', 512, true)
    .catch(() => console.log('[DB] ProductId attribute already exists, skipping...'))
  await db.createIntegerAttribute('main', 'streeplijsten', 'hoeveelheid', true)
    .catch(() => console.log('[DB] Hoeveelheid attribute already exists, skipping...'))
  await db.createDatetimeAttribute('main', 'streeplijsten', 'datum', true)
    .catch(() => console.log('[DB] Datum attribute already exists, skipping...'))
  await db.createBooleanAttribute('main', 'streeplijsten', 'verrekend', false, false)
    .catch(() => console.log('[DB] Verrekend attribute already exists, skipping...'))  

  await db.createCollection('main', 'inkopen', 'Inkopen', [
    Permission.read(Role.team('colosseum')),
    Permission.read(Role.team('senaat')),
    Permission.read(Role.team('admin')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
    Permission.create(Role.team('colosseum')),
    Permission.delete(Role.team('admin')),
    Permission.delete(Role.team('senaat')),
    Permission.delete(Role.team('colosseum')),
  ]).catch(() => console.log('[DB] Inkopen collection already exists, skipping...'))

  await db.createStringAttribute('main', 'inkopen', 'userId', 512, true)
    .catch(() => console.log('[DB] UserId attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'inkopen', 'productId', 512, true)
    .catch(() => console.log('[DB] ProductId attribute already exists, skipping...'))
  await db.createIntegerAttribute('main', 'inkopen', 'hoeveelheid', true)
    .catch(() => console.log('[DB] Hoeveelheid attribute already exists, skipping...'))
  await db.createDatetimeAttribute('main', 'inkopen', 'datum', true)
    .catch(() => console.log('[DB] Datum attribute already exists, skipping...'))
  await db.createFloatAttribute('main', 'inkopen', 'prijs', true)  
    .catch(() => console.log('[DB] Prijs attribute already exists, skipping...'))
  await db.createFloatAttribute('main', 'inkopen', 'statiegeld', true)  
    .catch(() => console.log('[DB] Statiegeld attribute already exists, skipping...'))
  await db.createStringAttribute('main', 'inkopen', 'winkel', 512, true)
    .catch(() => console.log('[DB] Winkel attribute already exists, skipping...'))
  await db.createDatetimeAttribute('main', 'inkopen', 'datum', true)
    .catch(() => console.log('[DB] Datum attribute already exists, skipping...'))
}

// Setup all user roles
async function setupTeams() {
  try {
    await teams.create('admin', 'Admin', ['owner'])
    await teams.create('senaat', 'Senaat', ['owner'])
    await teams.create('colosseum', 'Colosseum', ['owner'])
    await teams.create('kasco', 'KasCo', ['owner'])
    await teams.create('fepeco', 'FePeCo', ['owner'])
    await teams.create('lid', 'Lid', ['owner'])
    await teams.create('proeflid', 'Proeflid', ['owner'])
  } catch (_e) {
    console.log('[Teams] Teams already exist, skipping...')
  }
}

async function setupStorage() {
  // Create the user icon bucket
  await storage.createBucket('user-icons', 'User Icons', [
    Permission.read(Role.team('lid')),
    Permission.create(Role.team('lid')),
    Permission.create(Role.team('proeflid')),
    Permission.create(Role.team('proeflid')),
  ], true, true, 30000000, ['jpg', 'jpeg', 'png', 'gif'], 'gzip', false, true)
    .catch(() => console.log('[Storage] User icon bucket already exists, skipping...'))
}
