import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { requireAdmin } from "./middleware.ts";

export const router = new Router()

router.get('/', ctx => {
  ctx.response.body = 'Hello, World!'
})

router.get('/users/add-role', requireAdmin, ctx => {
  ctx.response.body = 'add-role'
})

router.get('/users/roles', ctx => {
  ctx.response.body = [
    'Admin'
  ]
})