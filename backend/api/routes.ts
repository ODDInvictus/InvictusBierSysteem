import { Client } from "https://deno.land/x/appwrite@6.1.0/mod.ts";
import { Application, helpers, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { sendMail } from "./email.ts";
import { requireAdmin } from "./middleware.ts";
import { teams, users } from "./sdk.ts";

export const router = new Router()

const URL = Deno.env.get('IBS_DOMAIN')!

router.get('/', ctx => {
  ctx.response.body = 'Hello, World!'
})

router.post('/users/add-role', async ctx => {
  const body = await ctx.request.body({ type: 'json' }).value

  const { role, email} = body

  if (!role || !email) {
    ctx.response.status = 400
    ctx.response.body = 'No role or email specified'
    return
  }

  console.log(URL)

  await teams.createMembership(role, email, ['member'], URL)

  ctx.response.body = `Added role ${role} to user with email${email}`
}, requireAdmin)

router.get('/users/roles', async ctx => {
  const body = await ctx.request.body({ type: 'json' }).value

  const { userId } = body
})

router.delete('/users/roles', requireAdmin, async ctx => {
  const body = await ctx.request.body({ type: 'json' }).value

  const { userId } = body
})

router.get('/roles', async ctx => {
  const roles = await teams.list()

  const list = roles.teams.map(role => role.name)

  ctx.response.body = list 
})


router.get('/users', requireAdmin, async ctx => {
  const u = await users.list()
  const t = await teams.list()

  const roles: Map<string, any> = new Map()
  const rolesPerUser: Map<string, any> = new Map()

  for (const team of t.teams) {
    const users = await teams.listMemberships(team.$id)

    for (const user of users.memberships) {
      if (!rolesPerUser.has(user.userId)) {
        rolesPerUser.set(user.userId, [])
      }

      rolesPerUser.get(user.userId).push(team.name)
    }

    roles.set(team.name, users.memberships.map(u => u.userId))
  }

  const res = {
    roles: {
      perRole: Object.fromEntries(roles),
      perUser: Object.fromEntries(rolesPerUser),
    },
    users: u.users.map(u => {
      return {
        $id: u.$id,
        email: u.email,
        name: u.name,
        prefs: u.prefs,
      }
    }),
  }

  ctx.response.body = res
})

/*
   EMAIL ROUTES
*/

router.post('/email', async ctx => {
  await sendMail()
  ctx.response.body = 'Email sent'
})