import { connect } from "https://deno.land/x/amqp/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"

const c = config({ safe: true, export: true })

console.log('Opening connection to RabbitMQ server @ ' + c.IBS_MQ_HOST)
const connection = await connect({
  hostname: c.IBS_MQ_HOST,
  username: c.IBS_MQ_USER,
  password: c.IBS_MQ_PASS,
})
console.log('Connection opened')
const channel = await connection.openChannel()

const queueName = "ibs.email"
await channel.declareQueue({ queue: queueName, durable: true })

await channel.consume({ queue: queueName }, async (args, props, data) => {
  console.log(JSON.stringify(args));
  console.log(JSON.stringify(props));
  console.log("Received message:", new TextDecoder().decode(data))
  await channel.ack({ deliveryTag: args.deliveryTag })
})