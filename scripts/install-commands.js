import 'dotenv/config'
import { getCommands } from '../api/discord.js'

const commands = getCommands()
const guildIds = process.env.GUILD_IDS.split(' ')
guildIds.forEach((guildId) => {
  const applicationId = process.env.APP_ID
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
