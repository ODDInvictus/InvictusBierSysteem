import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import * as sdk from 'https://deno.land/x/appwrite@6.1.0/mod.ts'
import { hasAdminPowers, Roles } from "./roles.ts"
import { userClients, users } from "./sdk.ts";

export async function requireAdmin(ctx: Context, next: any) {
  let token = ctx.request.headers.get('Authorization')

  if (!token) {
    ctx.response.status = 401
    ctx.response.body = {
      message: 'No Authorization header provided',
    }
    return
  }

  token = token.replace('Bearer ', '')

  let client = userClients.get(ctx)

  if (!client) {
    try {
      client = new sdk.Client()
      client
        .setEndpoint(Deno.env.get('IBS_APPWRITE_ENDPOINT')!)
        .setProject(Deno.env.get('IBS_APPWRITE_PROJECT')!)
        .setJWT(token)
      userClients.set(ctx, client)
    } catch (e) {
      ctx.response.status = 401
      ctx.response.body = {
        message: 'Invalid token',
      }
      return
    }
  }

  const teamsApi = new sdk.Teams(client)
  
  const teams = await teamsApi.list()

  const names = teams.teams.map(t => t.name)

  if (names.includes('Admin') || names.includes('Senaat')) {
    await next()
  } else {
    ctx.response.status = 403
    ctx.response.body = {
      message: 'You do not have the required permissions',
    }
    return
  }
}