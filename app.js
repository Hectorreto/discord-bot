import 'dotenv/config';
import express from 'express'
import { createCompletion } from './chatgpt.js';
import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';

const application = { id: process.env.APP_ID };
const API = 'https://discord.com/api/v10';
const app = express()

const discordValidation = (req, res, buf) => {
  const signature = req.get('X-Signature-Ed25519');
  const timestamp = req.get('X-Signature-Timestamp');
  const clientKey = process.env.PUBLIC_KEY;

  const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
  if (!isValidRequest) {
    res.status(401).send('Bad request signature');
    throw new Error('Bad request signature');
  }
}

app.use(express.json({ verify: discordValidation }));

app.post('/', (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === 'generar') {
      const message = interaction.data.options[0].value;
      const promiseCompletion = createCompletion(message);

      res.on('finish', async () => {
        const endpoint = `/webhooks/${application.id}/${interaction.token}/messages/@original`;
        const completion = await promiseCompletion;

        await fetch(API + endpoint, {
          method: 'PATCH',
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: completion }),
        });
      });

      return res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      })
    }
  }
})

app.listen(process.env.PORT, () => {
  const guildIds = process.env.GUILD_IDS;
  const commands = [
    {
      name: 'generar',
      description: 'Generar texto usando la api de ChatGpt',
      options: [
        {
          type: 3, // string
          name: 'mensaje',
          description: 'Mensaje a enviar a ChatGpt',
          required: true,
        }
      ]
    }
  ]
  
  guildIds.split(' ').forEach(guildId => {
    const endpoint = `/applications/${application.id}/guilds/${guildId}/commands`
  
    fetch(API + endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands)
    })
      .then(res => res.json())
      .then(data => data.map(command => command.name))
      .then(commands => console.log({ guildId, commands}))
  });

})
