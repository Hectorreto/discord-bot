import { InteractionResponseType } from 'discord-interactions'
import { createCompletion } from '../api/openai.js'
import { updateInteraction } from '../api/discord.js'

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
    const generatedText = await promise
    await updateInteraction(interaction, { content: generatedText })
  })

  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  })
}

export default { config, command }
