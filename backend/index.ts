import { db } from './sdk.ts'  

async function main() {

  const d = await db.getDocument('main', 'activities', '63493c2659b986f7e109')
    
  console.log(d)

}

if (import.meta.main) {

  main()
}