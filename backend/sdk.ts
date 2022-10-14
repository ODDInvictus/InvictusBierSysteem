import * as sdk from 'https://deno.land/x/appwrite@6.1.0/mod.ts'
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const client = new sdk.Client()

const c = config({ safe: true, export: true })

const key = c.IBS_APPWRITE_KEY
const endpoint = c.IBS_APPWRITE_ENDPOINT

if (!key || !endpoint) {
  console.error(`Environment variables not set! IBS_APPWRITE_KEY: ${key} IBS_APPWRITE_ENDPOINT: ${endpoint}`)
  Deno.exit(1)
}

client
  .setEndpoint('https://backend.nierot.com/v1')
  .setProject('ibs')
  .setKey(key)

const db = new sdk.Databases(client)
const users = new sdk.Users(client)


export { client, db, users }