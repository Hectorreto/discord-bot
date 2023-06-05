import { InteractionResponseType } from 'discord-interactions'
import { postInteraction } from '../api/discord.js'
import { createImage } from '../api/openai.js'

const config = {
  name: 'generar-imagen',
  description: 'Generar imagen usando la api de ChatGpt',
  options: [
    {
      type: 3, // string
      name: 'prompt',
      description: 'Descripción de la imagen a generar',
      required: true
    }
  ]
}

const command = (req, res) => {
  const interaction = req.body
  const message = interaction.data.options[0].value
  const promise = createImage(message)

  res.on('finish', async () => {
    const imageUrl = await promise
    await postInteraction(interaction, { content: imageUrl })
  })

  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  })
}

export default { config, command }
