import 'dotenv/config'
import express from 'express'
import { InteractionType, InteractionResponseType } from 'discord-interactions'
import { registerCommands, discordValidation } from './api/discord.js'

const commands = registerCommands()
const app = express()
app.use(express.json({ verify: discordValidation }))

app.post('/', (req, res) => {
  const interaction = req.body

  if (interaction.type === InteractionType.PING) {
    res.send({ type: InteractionResponseType.PONG })
    return
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const name = interaction.data.name

    if (commands[name]) {
      const { command } = commands[name]
      command(req, res)
    } else {
      console.log('El comando no existe')
    }
    return
  }

  console.log('Interacción no controlada')
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`)
})
