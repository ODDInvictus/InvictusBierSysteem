import { Permission, Role } from "https://deno.land/x/appwrite@6.1.0/mod.ts";
import { client, db, storage, teams, users } from "./sdk.ts";

if (import.meta.main) setupAppwrite()

async function setupAppwrite() {
  console.log('[Appwrite] Setting up Appwrite...')

  console.log('[Appwrite] Setting up teams...')	
  await setupTeams()
  console.log('[Appwrite] Setting up storage...')
  await setupStorage()
  console.log('[Appwrite] Setting up database...')
  await setupDatabase()

  // await setupEmail()
}

async function setupDatabase() {
  // await db.create('main', 'Main database')
  //   .catch(() => console.log('[DB] Main database already exists, skipping...'))

  // setup attributes
  // try {
  //   await db.createCollection('main', 'activiteiten', 'Activiteiten', [
  //     Permission.read(Role.team('lid')),
  //     Permission.read(Role.team('proeflid')),
  //     Permission.create(Role.team('admin')),
  //     Permission.create(Role.team('senaat')),
  //     Permission.create(Role.team('lid')),
  //     Permission.update(Role.team('admin')),
  //     Permission.update(Role.team('senaat')),
  //     Permission.update(Role.team('lid')),
  //     Permission.delete(Role.team('admin')),
  //     Permission.delete(Role.team('senaat')),
  //   ])

  //   await db.createStringAttribute('main', 'activiteiten', 'naam', 512, false, 'Reguliere Borrel')
  //   await db.createDatetimeAttribute('main', 'activiteiten', 'datum', true)
  //   await db.createStringAttribute('main', 'activiteiten', 'omschrijving', 4096, false, 'Omschrijving volgt')
  //   await db.createStringAttribute('main', 'activiteiten', 'organisatie', 512, false, 'Senaat')
  //   await db.createStringAttribute('main', 'activiteiten', 'aanwezigen', 128, false, undefined, true)
  //   await db.createStringAttribute('main', 'activiteiten', 'locatie', 512, true)
  // } catch (_e) {
  //   console.log('[DB] Activiteiten collection already exists, skipping...')	
  // }


  // Inventory
  // await db.createCollection('main', 'producten', 'Producten', [
  //   Permission.read(Role.team('colosseum')),
  //   Permission.read(Role.team('senaat')),
  //   Permission.read(Role.team('admin')),
  //   Permission.create(Role.team('admin')),
  //   Permission.create(Role.team('senaat')),
  //   Permission.create(Role.team('colosseum')),
  //   Permission.delete(Role.team('admin')),
  //   Permission.delete(Role.team('senaat')),
  //   Permission.delete(Role.team('colosseum')),
  // ])

  // await db.createStringAttribute('main', 'producten', 'naam', 512, true)
  // await db.createFloatAttribute('main', 'producten', 'alcohol', true, 0, 100)
  // await db.createIntegerAttribute('main', 'producten', 'inhoud', true)

  // try {
    await db.createCollection('main', 'transacties', 'Transacties', [
      Permission.read(Role.team('colosseum')),
      Permission.read(Role.team('senaat')),
      Permission.read(Role.team('admin')),
      Permission.create(Role.team('admin')),
      Permission.create(Role.team('senaat')),
      Permission.create(Role.team('colosseum')),
      Permission.delete(Role.team('admin')),
      Permission.delete(Role.team('senaat')),
      Permission.delete(Role.team('colosseum')),
    ])
  
    await db.createStringAttribute('main', 'transacties', 'userId', 512, true)
    await db.createStringAttribute('main', 'transacties', 'productId', 512, true)
    await db.createStringAttribute('main', 'transacties', 'activiteitId', 512, true)
    await db.createIntegerAttribute('main', 'transacties', 'hoeveelheid', true)
    await db.createDatetimeAttribute('main', 'transacties', 'datum', true)
    await db.createBooleanAttribute('main', 'transacties', 'verrekend', false, false)
    await db.createFloatAttribute('main', 'transacties', 'mutatie', true)
  // } catch (_e) {
  //   console.error(_e)
  //   console.log('[DB] Transacties collection already exists, skipping...')
  // }

  // volgende tabel voorraad per product
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

async function setupEmail() {
  // Create the email db
  await db.create('email', 'Email')
    .catch(() => console.log('[Email] Email collection already exists, skipping...'))

  // Create the email tables
  await db.createCollection('email', 'queue', 'Queue', [
    Permission.read(Role.team('admin')),
    Permission.read(Role.team('senaat')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
    Permission.create(Role.team('lid')),
    Permission.delete(Role.team('admin')),
    Permission.delete(Role.team('senaat')),
  ]).catch(() => console.log('[Email] Queue collection already exists, skipping...'))

  await db.createStringAttribute('email', 'queue', 'to', 512, true)
    .catch(() => console.log('[Email] To attribute already exists, skipping...'))
  await db.createStringAttribute('email', 'queue', 'subject', 512, true)
    .catch(() => console.log('[Email] Subject attribute already exists, skipping...'))
  await db.createStringAttribute('email', 'queue', 'body', 512, true)
    .catch(() => console.log('[Email] Body attribute already exists, skipping...'))
  await db.createStringAttribute('email', 'queue', 'template', 512, true)
    .catch(() => console.log('[Email] Template attribute already exists, skipping...'))


  await db.createCollection('email', 'templates', 'Templates', [
    Permission.read(Role.team('admin')),
    Permission.read(Role.team('senaat')),
    Permission.create(Role.team('admin')),
    Permission.delete(Role.team('admin')),
  ]).catch(() => console.log('[Email] Templates collection already exists, skipping...'))

  await db.createStringAttribute('email', 'templates', 'name', 512, true)
    .catch(() => console.log('[Email] Name attribute already exists, skipping...'))

  await db.createDocument('email', 'templates', 'reguliere_email', {
    name: 'Reguliere Email',
  }).catch(() => console.log('[Email] Reguliere Email template already exists, skipping...'))
  await db.createDocument('email', 'templates', 'forward', {
    name: 'Forward',
  }).catch(() => console.log('[Email] Forward template already exists, skipping...'))
  await db.createDocument('email', 'templates', 'nieuwsbrief', {
    name: 'Nieuwsbrief',
  }).catch(() => console.log('[Email] Nieuwsbrief template already exists, skipping...'))
  await db.createDocument('email', 'templates', 'uitnodiging', {
    name: 'Uitnodiging',
  }).catch(() => console.log('[Email] Uitnodiging template already exists, skipping...'))
  await db.createDocument('email', 'templates', 'verjaardag', {
    name: 'Verjaardag',
  }).catch(() => console.log('[Email] Verjaardag template already exists, skipping...'))

  await db.createCollection('email', 'sent', 'Sent', [
    Permission.read(Role.team('admin')),
    Permission.read(Role.team('senaat')),
    Permission.create(Role.team('admin')),
    Permission.create(Role.team('senaat')),
    Permission.delete(Role.team('admin')),
    Permission.delete(Role.team('senaat')),
  ]).catch(() => console.log('[Email] Sent collection already exists, skipping...'))

  await db.createCollection('email', 'settings', 'Settings', [
    Permission.read(Role.team('admin')),
  ]).catch(() => console.log('[Email] Settings collection already exists, skipping...'))

  await db.createStringAttribute('email', 'settings', 'SMTP_SERVER', 512, true)
    .catch(() => console.log('[Email] SMTP_SERVER attribute already exists, skipping...'))
  await db.createStringAttribute('email', 'settings', 'SMTP_PORT', 512, true)
    .catch(() => console.log('[Email] SMTP_PORT attribute already exists, skipping...'))
  await db.createStringAttribute('email', 'settings', 'SMTP_USERNAME', 512, true)
    .catch(() => console.log('[Email] SMTP_USERNAME attribute already exists, skipping...'))
  await db.createStringAttribute('email', 'settings', 'SMTP_KEY', 512, true)
    .catch(() => console.log('[Email] SMTP_KEY attribute already exists, skipping...'))
  await db.createIntegerAttribute('email', 'settings', 'MAX_EMAILS_PER_HOUR', true)
    .catch(() => console.log('[Email] MAX_EMAILS_PER_HOUR attribute already exists, skipping...'))
  await db.createIntegerAttribute('email', 'settings', 'MAX_EMAILS_PER_DAY', true)
    .catch(() => console.log('[Email] MAX_EMAILS_PER_DAY attribute already exists, skipping...'))
  await db.createIntegerAttribute('email', 'settings', 'ALREADY_SEND_THIS_HOUR', true)
    .catch(() => console.log('[Email] MAX_EMAILS_PER_HOUR attribute already exists, skipping...'))
  await db.createIntegerAttribute('email', 'settings', 'ALREADY_SEND_THIS_DAY', true)
    .catch(() => console.log('[Email] MAX_EMAILS_PER_DAY attribute already exists, skipping...'))  
  await db.createStringAttribute('email', 'settings', 'FROM_EMAIL', 512, true)
    .catch(() => console.log('[Email] FROM_EMAIL attribute already exists, skipping...'))
}