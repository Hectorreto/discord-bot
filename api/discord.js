import { verifyKey } from 'discord-interactions'
import generar from '../commands/generar.js'
import generarImagen from '../commands/generar-imagen.js'

export const discordValidation = (req, res, buf) => {
  const signature = req.get('X-Signature-Ed25519')
  const timestamp = req.get('X-Signature-Timestamp')
  const clientKey = process.env.PUBLIC_KEY

  const isValidRequest = verifyKey(buf, signature, timestamp, clientKey)
  if (!isValidRequest) {
    res.status(401).send('Bad request signature')
    throw new Error('Bad request signature')
  }
}

export const getCommands = () => {
  const commands = [
    generar,
    generarImagen
  ]
  return commands
}

export const registerCommands = () => {
  const commands = getCommands()
  return Object.fromEntries(commands.map((value) =>
    [value.config.name, value]
  ))
}

export const updateInteraction = async (interaction, data) => {
  const API = 'https://discord.com/api/v10'
  const applicationId = process.env.APP_ID
  const endpoint = `/webhooks/${applicationId}/${interaction.token}/messages/@original`

  await fetch(API + endpoint, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const postInteraction = async (interaction, data) => {
  const API = 'https://discord.com/api/v10'
  const applicationId = process.env.APP_ID
  const endpoint = `/webhooks/${applicationId}/${interaction.token}`

  await fetch(API + endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
