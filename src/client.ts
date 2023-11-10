import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

import * as pingCommand from './commands/ping.js';
import * as pokemonCommand from './commands/pokemon.js';
import * as riotCommand from './commands/riot.js';
import * as preguntaCommand from './commands/generar.js';

const { DISCORD_TOKEN } = process.env;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
});

const commands = {
	[pingCommand.data.name]: pingCommand,
	[pokemonCommand.data.name]: pokemonCommand,
	[riotCommand.data.name]: riotCommand,
	[preguntaCommand.data.name]: preguntaCommand,
};

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) { return; }

	const command = commands[interaction.commandName];
	if (command) {
		command.execute(interaction).catch(console.error);
	}
});

client.on(Events.MessageReactionAdd, (reaction) => {
	// console.log(`${user.tag} reacted with ${reaction.emoji.name} to the message.`);
	if (reaction.emoji.name === '❌') {
		if (!reaction.message.deletable) return;
		reaction.message.delete().catch(console.error);
	}
});

client.login(DISCORD_TOKEN);
