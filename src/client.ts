import 'dotenv/config';
import {Client, GatewayIntentBits} from 'discord.js';

import * as pingCommand from './commands/ping.js';
import * as pokemonCommand from './commands/pokemon.js';
import * as riotCommand from './commands/riot.js';

const {DISCORD_TOKEN} = process.env;
const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) { return; }

	if (interaction.commandName === 'ping') {
		await pingCommand.execute(interaction);
	}

	if (interaction.commandName === 'pokemon') {
		await pokemonCommand.execute(interaction);
	}

	if (interaction.commandName === 'riot') {
		await riotCommand.execute(interaction);
	}
});

client.login(DISCORD_TOKEN);
