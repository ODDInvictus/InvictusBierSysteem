import { db } from "./sdk.ts"
import { AmqpChannel, AmqpConnection, connect } from "https://deno.land/x/amqp/mod.ts"

async function makeConnection(): Promise<[AmqpConnection, AmqpChannel]> {
  console.log('Opening connection to RabbitMQ server @ ' + Deno.env.get('IBS_MQ_HOST'))
  const connection = await connect({
    hostname: Deno.env.get('IBS_MQ_HOST')!,
    username: Deno.env.get('IBS_MQ_USER')!,
    password: Deno.env.get('IBS_MQ_PASS')!,
  })
  console.log('Connection opened')
  const channel = await connection.openChannel()
  await channel.declareQueue({ queue: "ibs.email", durable: true })

  return [connection, channel]
}

export async function sendMail() {
  const [connection, channel] = await makeConnection()

  channel.publish(
    { routingKey: 'ibs.email' },
    { contentType: 'application/json' },
    new TextEncoder().encode(JSON.stringify({
      to: 'test@example.com'
    }))
  )

  await connection.close()
}