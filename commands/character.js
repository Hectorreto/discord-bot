import { InteractionResponseType } from 'discord-interactions'
import { createCompletion2 } from '../api/characterai.js'
import { updateInteraction } from '../api/discord.js'

const config = {
  name: 'character',
  description: 'Hablar con Yui',
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
  const promise = createCompletion2(message)

  res.on('finish', async () => {
    await updateInteraction(interaction, await promise)
  })

  res.send({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  })
}

export default { config, command }
