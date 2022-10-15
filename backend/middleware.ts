import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import { helpers } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Roles } from "./roles.ts"

export function requireAdmin(ctx: Context, next: any) {
  const query = helpers.getQuery(ctx)

  const apiKey = query['apiKey']
  const userId = query['userId']

  if (!apiKey || !userId) {
    ctx.response.status = 400
    ctx.response.body = `Missing query parameters! apiKey: ${apiKey} userId: ${userId}`
    return
  }
  

  ctx.response.status = 403
  ctx.response.body = 'You do not have access to this resource!'
}