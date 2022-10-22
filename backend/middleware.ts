import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import { helpers } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { hasAdminPowers, Roles } from "./roles.ts"
import { users } from "./sdk.ts";

export async function requireAdmin(ctx: Context, next: any) {
  const query = helpers.getQuery(ctx)

  const apiKey = query['apiKey']
  const userId = query['userId']

  return

  if (!apiKey || !userId) {
    ctx.response.status = 400
    ctx.response.body = {
      message: 'Missing query parameters!',
      requiredParameters: ['apiKey', 'userId'],
      parameters: query
    } 
    
    return
  }

  await hasAdminPowers(userId)

  ctx.response.status = 403
  ctx.response.body = 'You do not have access to this resource!'
}