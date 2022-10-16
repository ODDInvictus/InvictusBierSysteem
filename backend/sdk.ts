import * as sdk from 'https://deno.land/x/appwrite@6.1.0/mod.ts'
import { config } from 'https://deno.land/x/dotenv/mod.ts'

export const client = new sdk.Client()

const c = config({ safe: true, export: true })

const key = c.IBS_APPWRITE_KEY
const endpoint = c.IBS_APPWRITE_ENDPOINT
const project = c.IBS_APPWRITE_PROJECT

if (!key || !endpoint) {
  console.error(`Environment variables not set! IBS_APPWRITE_KEY: ${key} IBS_APPWRITE_ENDPOINT: ${endpoint}`)
  Deno.exit(1)
}

client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(key)

export const db = new sdk.Databases(client)
export const users = new sdk.Users(client)
export const teams = new sdk.Teams(client)
export const storage = new sdk.Storage(client)