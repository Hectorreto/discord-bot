import { ChatInputCommandInteraction } from 'discord.js';

export const data = {
	name: 'ping',
	description: 'Check the bot\'s ping and response time.',
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const ping = Date.now() - interaction.createdTimestamp;

	await interaction.reply(`🏓 Pong! Bot latency is ${ping}ms.`);
};
