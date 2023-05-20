// import fetch from 'node-fetch'
import { verifyKey } from 'discord-interactions'
import generar from '../commands/generar.js'
// import character from '../commands/character.js'

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

export const registerCommands = () => {
  const commands = [
    generar
    // character
  ]
  const applicationId = process.env.APP_ID
  const guildIds = process.env.GUILD_IDS.split(' ')

  guildIds.forEach((guildId) => {
    const API = 'https://discord.com/api/v10'
    const endpoint = `/applications/${applicationId}/guilds/${guildId}/commands`

    fetch(API + endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands.map((command) => command.config))
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          throw data
        }
        return data
      })
      .then((data) => data.map((command) => command.name))
      .then((commands) => console.log({ guildId, commands }))
      .catch((err) => console.log('Error cargando', guildId, JSON.stringify(err, null, 2)))
  })

  return Object.fromEntries(commands.map((value) =>
    [value.config.name, value]
  ))
}
