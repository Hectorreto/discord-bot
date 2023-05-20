// import fetch from 'node-fetch'
import { InteractionResponseType } from 'discord-interactions'
import { createCompletion } from '../api/openai.js'

const config = {
  name: 'generar',
  description: 'Generar texto usando la api de ChatGpt',
  options: [
    {
      type: 3, // string
      name: 'mensaje',
      description: 'Mensaje a enviar a ChatGpt',
      required: true
    }
  ]
}

const command = (req, res) => {
  const interaction = req.body
  const message = interaction.data.options[0].value
  const promise = createCompletion(message)

  res.on('finish', async () => {
    const API = 'https://discord.com/api/v10'
    const applicationId = process.env.APP_ID
    const endpoint = `/webhooks/${applicationId}/${interaction.token}/messages/@original`
    const completion = await promise

    await fetch(API + endpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: completion })
    })
  })

  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  })
}

export default { config, command }
