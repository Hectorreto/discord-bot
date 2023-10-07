import {REST, Routes} from 'discord.js';

import * as pingCommand from './commands/ping.js';
import * as pokemonCommand from './commands/pokemon.js';
import * as riotCommand from './commands/riot.js';

const {DISCORD_TOKEN, DISCORD_CLIENT_ID} = process.env;
const rest = new REST({version: '10'}).setToken(DISCORD_TOKEN);

const commands = [pingCommand.data, pokemonCommand.data, riotCommand.data];

try {
	console.log('Started refreshing application (/) commands.');

	await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
		body: commands,
	});

	console.log('Successfully reloaded application (/) commands.');
} catch (error) {
	console.error(error);
}
