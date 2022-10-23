import { db } from "./sdk.ts"
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

let client: SMTPClient

export function initMail() {
  try {
    client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('IBS_SMTP_SERVER')!,
        port: 465,
        auth: {
          username: Deno.env.get('IBS_SMTP_LOGIN')!,
          password: Deno.env.get('IBS_SMTP_KEY')!,
        }
      }
    })
  } catch (err) {
    console.error(err)
  }
} 

export async function sendMail() {
  await client.send({
    from: Deno.env.get('IBS_SMTP_FROM_EMAIL')!,
    replyTo: Deno.env.get('IBS_SMTP_REPLY_TO_EMAIL')!,
    to: Deno.env.get('IBS_SMTP_FROM_EMAIL')!,
    subject: 'Test',
    content: 'Test',
  })
}