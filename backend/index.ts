import { db } from './sdk.ts'  
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from "./routes.ts";

const app = new Application()

// middleware
app.use(oakCors())

app.use(router.routes())
app.use(router.allowedMethods())
app.addEventListener(
  "listen",
  () => console.log("Listening on http://localhost:8080"),
)

async function main() {
  await app.listen({ port: 8080 })

  const d = await db.getDocument('main', 'activities', '63493c2659b986f7e109')
    
  console.log(d)

}

if (import.meta.main) main()
